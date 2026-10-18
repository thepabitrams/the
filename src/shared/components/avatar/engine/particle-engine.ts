import { CONFIG } from '../config';
import { extractPointsFromImage } from '../ImageUtils';
import type { Particle, EngineState, Point } from '../types';
import { createParticlesFromPoints, getDynamicParticleSize, syncCountTo } from './particle-factory';
import { rotateAroundY, depthFactor, depthScale } from './sphere-geometry';
import { applyAttraction, applyHover, integrate, applyBoundaries, type PointerState } from './physics';
import { drawParticles } from './renderer';
import { prepareNextImage } from './image-transition';
import { InteractionHandler } from './interaction-handler';
import { CanvasManager } from './canvas-manager';
import { MorphManager } from './morph-manager';
import { BlastManager } from './blast-manager';

export class ParticleEngine {
  private canvasManager: CanvasManager;
  private interactions: InteractionHandler;
  
  private particles: Particle[] = [];
  private pointer: PointerState = { x: -9999, y: -9999, active: false };
  private imagesLight: string[];
  private imagesDark: string[];

  private currentIndex = 0;
  private state: EngineState = 'IDLE';
  private stateTimer: ReturnType<typeof setTimeout> | null = null;
  private animationFrameId = 0;
  private rotationAngle = 0;

  private lastImageOrigins: { x: number; y: number }[] = [];
  private pendingImageOrigins: Point[] | null = null;
  private expansionTarget: 'IMAGE' | 'GLOBE' = 'IMAGE';
  private transitionScale = 1;
  
  private previousPortalY = 0;
  private themeRequestId = 0;

  constructor(localCanvas: HTMLCanvasElement, blastCanvas: HTMLCanvasElement, imagesLight: string[], imagesDark: string[], anchorId: string) {
    this.imagesLight = imagesLight;
    this.imagesDark = imagesDark;
    
    this.canvasManager = new CanvasManager(localCanvas, blastCanvas, anchorId);
    
    this.interactions = new InteractionHandler({
      onHover: (pointerState) => { this.pointer = pointerState; },
      onBlast: () => this.triggerBlast(),
      onResize: () => this.handleResize(),
      onScroll: () => this.handleScroll(),
      onThemeChange: () => { void this.handleThemeChange(); }
    });
  }

  public init(): void {
    this.canvasManager.resizeLocal();
    this.previousPortalY = this.canvasManager.portalCenter.y;
    this.interactions.init();
    void this.loadInitialImage();
    this.animate();
  }

  private handleThemeChange = async (): Promise<void> => {
    const requestId = ++this.themeRequestId;
    const url = this.getCurrentImageUrl();
    const { x, y } = this.canvasManager.portalCenter;
    const size = this.canvasManager.anchorSize;
    const points = await extractPointsFromImage(url, size, x, y);

    if (requestId !== this.themeRequestId) return;
    if (points.length === 0) return;

    if (this.state !== 'IDLE') {
      this.lastImageOrigins = points.map((point) => ({ x: point.x, y: point.y }));
      return;
    }

    syncCountTo(this.particles, points.length, this.canvasManager.portalCenter);
    
    for (let index = 0; index < this.particles.length; index++) {
      this.particles[index].targetX = points[index].x;
      this.particles[index].targetY = points[index].y;
    }
    
    this.lastImageOrigins = points.map((point) => ({ x: point.x, y: point.y }));
  };

  private handleResize = (): void => {
    this.canvasManager.resizeLocal();
    this.canvasManager.resizeBlast();
    this.previousPortalY = this.canvasManager.portalCenter.y;
  };

  private handleScroll = (): void => {
    const rect = this.canvasManager.getAnchorRect();
    const currentY = rect.top + rect.height / 2;
    const scrollDeltaY = currentY - this.previousPortalY;
    this.previousPortalY = currentY;

    if (scrollDeltaY !== 0) {
      for (const particle of this.particles) {
        particle.targetY += scrollDeltaY;
      }
      for (const origin of this.lastImageOrigins) {
        origin.y += scrollDeltaY;
      }
    }
  };

  private loadInitialImage = async (): Promise<void> => {
    const url = this.getCurrentImageUrl();
    const { x, y } = this.canvasManager.portalCenter;
    const size = this.canvasManager.anchorSize;
    const points = await extractPointsFromImage(url, size, x, y);
    
    this.particles = createParticlesFromPoints(points);
    this.lastImageOrigins = points.map((point) => ({ x: point.x, y: point.y }));
    this.transitionScale = 1;
    this.state = 'IDLE';
    this.scheduleNextCycle();
  };

  private getCurrentImageUrl = (): string => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const sources = isDarkMode ? this.imagesDark : this.imagesLight;
    return sources[this.currentIndex % sources.length];
  };

  private scheduleNextCycle = (): void => {
    this.clearStateTimer();
    this.stateTimer = setTimeout(() => {
      if (this.state === 'IDLE') this.startGlobeTransition();
    }, CONFIG.idleDelayMs);
  };

  private startGlobeTransition = (): void => {
    if (this.particles.length === 0) return;
    this.state = 'COLLAPSING';
    this.expansionTarget = 'GLOBE';
    this.transitionScale = 1;
  };

  private handleCollapseComplete = (): void => {
    if (this.expansionTarget === 'GLOBE') {
      MorphManager.prepareGlobe(this.particles, this.canvasManager.portalCenter);
      this.rotationAngle = 0;
    } else if (this.expansionTarget === 'IMAGE' && this.pendingImageOrigins) {
      MorphManager.prepareImage(this.particles, this.pendingImageOrigins, this.canvasManager.portalCenter);
      this.lastImageOrigins = this.pendingImageOrigins.map((point) => ({ x: point.x, y: point.y }));
      this.pendingImageOrigins = null;
    }
    this.state = 'EXPANDING';
  };

  private handleExpansionComplete = (): void => {
    if (this.expansionTarget === 'GLOBE') {
      this.state = 'ROTATING_GLOBE';
      this.clearStateTimer();
      this.stateTimer = setTimeout(() => {
        if (this.state === 'ROTATING_GLOBE') void this.prepareNextImage();
      }, CONFIG.globeHoldTimeMs);
    } else if (this.expansionTarget === 'IMAGE') {
      this.state = 'IDLE';
      this.scheduleNextCycle();
    }
  };

  private prepareNextImage = async (): Promise<void> => {
    this.currentIndex++;
    const url = this.getCurrentImageUrl();
    const { x, y } = this.canvasManager.portalCenter;
    const size = this.canvasManager.anchorSize;
    const points = await prepareNextImage(url, size, x, y);

    if (this.state !== 'ROTATING_GLOBE') return;

    this.pendingImageOrigins = points ? points : this.lastImageOrigins;
    this.state = 'COLLAPSING';
    this.expansionTarget = 'IMAGE';
    this.transitionScale = 1;
  };

  private triggerBlast = (): void => {
    if (this.state === 'BLASTING') return;

    const wasGlobe = this.state !== 'IDLE';
    const dynamicSize = getDynamicParticleSize();

    if (wasGlobe && this.lastImageOrigins.length > 0) {
      syncCountTo(this.particles, this.lastImageOrigins.length, this.canvasManager.portalCenter);
      for (let index = 0; index < this.particles.length; index++) {
        this.particles[index].targetX = this.lastImageOrigins[index].x;
        this.particles[index].targetY = this.lastImageOrigins[index].y;
        this.particles[index].baseSize = dynamicSize;
        this.particles[index].size = dynamicSize;
        this.particles[index].renderDepth = 1;
      }
      this.transitionScale = 1;
    }

    this.pendingImageOrigins = null;
    this.state = 'BLASTING';
    this.clearStateTimer();

    BlastManager.applyBlast(
      this.particles, 
      this.canvasManager, 
      this.lastImageOrigins, 
      () => {
        this.state = 'IDLE';
        this.scheduleNextCycle();
      }
    );
  };

  private animate = (): void => {
    const isBlasting = this.state === 'BLASTING';
    
    if (isBlasting) {
      this.canvasManager.clearBlast();
    } else {
      this.canvasManager.clearLocal();
    }

    const color = document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000';
    const width = isBlasting ? window.innerWidth : this.canvasManager.localCanvas.width / (window.devicePixelRatio || 1);
    const height = isBlasting ? window.innerHeight : this.canvasManager.localCanvas.height / (window.devicePixelRatio || 1);

    if (this.state === 'COLLAPSING') {
      this.transitionScale -= CONFIG.transitionSpeed;
      if (this.transitionScale <= 0) { 
        this.transitionScale = 0; 
        this.handleCollapseComplete(); 
      }
    } else if (this.state === 'EXPANDING') {
      this.transitionScale += CONFIG.transitionSpeed;
      if (this.transitionScale >= 1) { 
        this.transitionScale = 1; 
        this.handleExpansionComplete(); 
      }
    }

    const isGlobeShape = this.state === 'ROTATING_GLOBE' || 
      (this.state === 'EXPANDING' && this.expansionTarget === 'GLOBE') || 
      (this.state === 'COLLAPSING' && this.expansionTarget === 'IMAGE');

    const isRotating = this.state === 'ROTATING_GLOBE' || 
      (this.state === 'EXPANDING' && this.expansionTarget === 'GLOBE');

    if (isRotating) this.rotationAngle += CONFIG.globeRotationSpeed;

    const isTransitioning = this.state === 'COLLAPSING' || this.state === 'EXPANDING';
    const currentEase = (isGlobeShape && !isTransitioning) ? 0.15 : CONFIG.ease;
    const currentRadius = window.innerWidth < 768 ? CONFIG.globeRadius * 0.6 : CONFIG.globeRadius;

    const rect = this.canvasManager.getAnchorRect();
    const activePointer = { ...this.pointer };
    if (!isBlasting && activePointer.active) {
      activePointer.x -= rect.left;
      activePointer.y -= rect.top;
    }

    for (const particle of this.particles) {
      if (isRotating) {
        const rotated = rotateAroundY(particle, this.rotationAngle);
        const depth = depthFactor(rotated.z);
        particle.targetX = this.canvasManager.portalCenter.x + rotated.x * currentRadius;
        particle.targetY = this.canvasManager.portalCenter.y + rotated.y * currentRadius;
        particle.size = Math.max(0.8, particle.baseSize * depthScale(depth, 0.6));
        particle.renderDepth = depth;
      } else if (!isGlobeShape && !isBlasting) {
        particle.renderDepth = 1;
        particle.size = particle.baseSize;
      }

      particle.originX = this.canvasManager.portalCenter.x + (particle.targetX - this.canvasManager.portalCenter.x) * this.transitionScale;
      particle.originY = this.canvasManager.portalCenter.y + (particle.targetY - this.canvasManager.portalCenter.y) * this.transitionScale;

      if (isTransitioning) {
        particle.x = particle.originX;
        particle.y = particle.originY;
        particle.velocityX = 0;
        particle.velocityY = 0;
      } else {
        applyAttraction(particle, currentEase * (isBlasting ? 0.3 : 1));
        applyHover(particle, activePointer);
        integrate(particle, isBlasting);
        if (isBlasting) applyBoundaries(particle, width, height);
      }
    }

    const context = isBlasting ? this.canvasManager.blastContext : this.canvasManager.localContext;
    drawParticles(context, this.particles, color, isGlobeShape);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private clearStateTimer(): void {
    if (this.stateTimer) { 
      clearTimeout(this.stateTimer); 
      this.stateTimer = null; 
    }
  }

  public destroy = (): void => {
    this.clearStateTimer();
    cancelAnimationFrame(this.animationFrameId);
    this.interactions.destroy();
  };
}