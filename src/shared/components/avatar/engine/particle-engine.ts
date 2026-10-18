import { CONFIG } from '../config';
import { extractPointsFromImage } from '../ImageUtils';
import type { Particle, EngineState, Point } from '../types';
import { createParticlesFromPoints, getDynamicParticleSize, syncCountTo } from './particle-factory';
import { rotateAroundY, depthFactor, depthScale } from './sphere-geometry';
import { applyAttraction, applyHover, integrate, applyBoundaries, applyBlastImpulse, type PointerState } from './physics';
import { drawParticles } from './renderer';
import { prepareNextImage } from './image-transition';
import { InteractionHandler } from './interaction-handler';
import { CanvasManager } from './canvas-manager';
import { MorphManager } from './morph-manager';

export class ParticleEngine {
  private canvasManager: CanvasManager;
  private interactions: InteractionHandler;
  
  private particles: Particle[] = [];
  private pointer: PointerState = { x: -9999, y: -9999, active: false };
  private imagesLight: string[];
  private imagesDark: string[];

  private currentIndex = 0;
  private state: EngineState = 'IDLE';
  private timer: ReturnType<typeof setTimeout> | null = null;
  private animationFrameId = 0;
  private rotationAngle = 0;

  private lastImageOrigins: { x: number; y: number }[] = [];
  private pendingImageOrigins: Point[] | null = null;
  private expansionTarget: 'IMAGE' | 'GLOBE' = 'IMAGE';
  private transitionScale = 1;
  
  private previousPortalY = 0;
  private themeRequestId = 0;

  constructor(canvas: HTMLCanvasElement, imagesLight: string[], imagesDark: string[], anchorId: string) {
    this.imagesLight = imagesLight;
    this.imagesDark = imagesDark;
    
    this.canvasManager = new CanvasManager(canvas, anchorId);
    
    this.interactions = new InteractionHandler({
      onHover: (pointerState) => { this.pointer = pointerState; },
      onBlast: () => this.triggerBlast(),
      onResize: () => this.handleResize(),
      onScroll: () => this.handleScroll(),
      onThemeChange: () => { void this.handleThemeChange(); }
    });
  }

  public init(): void {
    this.canvasManager.resize();
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
      this.lastImageOrigins = points.map((p) => ({ x: p.x, y: p.y }));
      return;
    }

    syncCountTo(this.particles, points.length, this.canvasManager.portalCenter);
    
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].targetX = points[i].x;
      this.particles[i].targetY = points[i].y;
    }
    
    this.lastImageOrigins = points.map((p) => ({ x: p.x, y: p.y }));
  };

  private handleResize = (): void => {
    this.canvasManager.resize();
    this.previousPortalY = this.canvasManager.portalCenter.y;
  };

  private handleScroll = (): void => {
    this.canvasManager.updateCenter();
    const scrollDeltaY = this.canvasManager.portalCenter.y - this.previousPortalY;
    this.previousPortalY = this.canvasManager.portalCenter.y;

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
    this.lastImageOrigins = points.map((p) => ({ x: p.x, y: p.y }));
    this.transitionScale = 1;
    this.state = 'IDLE';
    this.scheduleNextCycle();
  };

  private getCurrentImageUrl = (): string => {
    const isDark = document.documentElement.classList.contains('dark');
    const sources = isDark ? this.imagesDark : this.imagesLight;
    return sources[this.currentIndex % sources.length];
  };

  private scheduleNextCycle = (): void => {
    this.clearTimer();
    this.timer = setTimeout(() => {
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
      this.lastImageOrigins = this.pendingImageOrigins.map((p) => ({ x: p.x, y: p.y }));
      this.pendingImageOrigins = null;
    }
    this.state = 'EXPANDING';
  };

  private handleExpansionComplete = (): void => {
    if (this.expansionTarget === 'GLOBE') {
      this.state = 'ROTATING_GLOBE';
      this.clearTimer();
      this.timer = setTimeout(() => {
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
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].targetX = this.lastImageOrigins[i].x;
        this.particles[i].targetY = this.lastImageOrigins[i].y;
        this.particles[i].baseSize = dynamicSize;
        this.particles[i].size = dynamicSize;
        this.particles[i].renderDepth = 1;
      }
      this.transitionScale = 1;
    }

    this.pendingImageOrigins = null;
    this.state = 'BLASTING';
    this.clearTimer();

    const maxSpeed = window.innerWidth / 25;
    for (const particle of this.particles) applyBlastImpulse(particle, maxSpeed);

    this.timer = setTimeout(() => {
      this.state = 'IDLE';
      this.scheduleNextCycle();
    }, CONFIG.blastRecoveryMs);
  };

  private animate = (): void => {
    this.canvasManager.clear();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const color = document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000';

    if (this.state === 'COLLAPSING') {
      this.transitionScale -= CONFIG.transitionSpeed;
      if (this.transitionScale <= 0) { this.transitionScale = 0; this.handleCollapseComplete(); }
    } else if (this.state === 'EXPANDING') {
      this.transitionScale += CONFIG.transitionSpeed;
      if (this.transitionScale >= 1) { this.transitionScale = 1; this.handleExpansionComplete(); }
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

    for (const particle of this.particles) {
      if (isRotating) {
        const rotated = rotateAroundY(particle, this.rotationAngle);
        const depth = depthFactor(rotated.z);
        particle.targetX = this.canvasManager.portalCenter.x + rotated.x * currentRadius;
        particle.targetY = this.canvasManager.portalCenter.y + rotated.y * currentRadius;
        particle.size = Math.max(0.8, particle.baseSize * depthScale(depth, 0.6));
        particle.renderDepth = depth;
      } else if (!isGlobeShape) {
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
        applyAttraction(particle, currentEase * (this.state === 'BLASTING' ? 0.3 : 1));
        applyHover(particle, this.pointer);
        integrate(particle, this.state === 'BLASTING');
        if (this.state === 'BLASTING') applyBoundaries(particle, width, height);
      }
    }

    drawParticles(this.canvasManager.context, this.particles, color, isGlobeShape);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private clearTimer(): void {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
  }

  public destroy = (): void => {
    this.clearTimer();
    cancelAnimationFrame(this.animationFrameId);
    this.interactions.destroy();
  };
}