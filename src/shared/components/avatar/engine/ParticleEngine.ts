import { CONFIG } from '../config';
import { extractPointsFromImage } from '../ImageUtils';
import type { Particle, EngineState, Point } from '../types';
import { createParticlesFromPoints, syncCountTo } from './ParticleFactory';
import {
  buildFibonacciSphere,
  rotateAroundY,
  depthFactor,
  depthScale,
} from './SphereGeometry';
import {
  applyAttraction,
  applyHover,
  integrate,
  applyBlastImpulse,
  type PointerState,
} from './Physics';
import { drawParticles } from './Renderer';
import { prepareNextImage } from './ImageTransition';

export class ParticleEngine {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private pointer: PointerState = { x: -9999, y: -9999, active: false };

  private imagesLight: string[];
  private imagesDark: string[];

  private currentIndex = 0;
  private state: EngineState = 'IDLE';
  private timer: ReturnType<typeof setTimeout> | null = null;
  private animationFrameId = 0;
  private rotationAngle = 0;
  private portalCenter = { x: 0, y: 0 };

  private lastImageOrigins: { x: number; y: number }[] = [];
  private pendingImageOrigins: Point[] | null = null;
  private expansionTarget: 'IMAGE' | 'GLOBE' = 'IMAGE';
  private transitionScale = 1;
  private observer: MutationObserver | null = null;

  constructor(canvas: HTMLCanvasElement, imagesLight: string[], imagesDark: string[]) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.imagesLight = imagesLight;
    this.imagesDark = imagesDark;
    this.updatePortalCenter();
  }

  public init(): void {
    this.resizeCanvas();
    void this.loadInitialImage();
    this.animate();
    this.setupEvents();
  }

  private updatePortalCenter = (): void => {
    this.portalCenter = { x: window.innerWidth * 0.25, y: window.innerHeight / 2 };
  };

  private resizeCanvas = (): void => {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.canvas.width = Math.floor(window.innerWidth * ratio);
    this.canvas.height = Math.floor(window.innerHeight * ratio);
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.updatePortalCenter();
  };

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private getCurrentImageUrl = (): string => {
    const isDark = document.documentElement.classList.contains('dark');
    const sources = isDark ? this.imagesDark : this.imagesLight;
    return sources[this.currentIndex % sources.length];
  };

  private loadInitialImage = async (): Promise<void> => {
    const url = this.getCurrentImageUrl();
    const points = await extractPointsFromImage(url, window.innerWidth, window.innerHeight);
    this.particles = createParticlesFromPoints(points);
    this.lastImageOrigins = points.map((point) => ({ x: point.x, y: point.y }));
    this.transitionScale = 1;
    this.state = 'IDLE';
    this.scheduleNextCycle();
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
      syncCountTo(this.particles, CONFIG.globeParticleCount, this.portalCenter);
      const bases = buildFibonacciSphere(this.particles.length);
      
      for (let i = 0; i < this.particles.length; i++) {
        const particle = this.particles[i];
        const basis = bases[i];
        particle.baseX = basis.baseX;
        particle.baseY = basis.baseY;
        particle.baseZ = basis.baseZ;
        particle.baseSize = CONFIG.particleSize;
        
        const rotated = rotateAroundY(particle, 0);
        particle.targetX = this.portalCenter.x + rotated.x * CONFIG.globeRadius;
        particle.targetY = this.portalCenter.y + rotated.y * CONFIG.globeRadius;
        particle.x = this.portalCenter.x;
        particle.y = this.portalCenter.y;
        particle.velocityX = 0;
        particle.velocityY = 0;
      }
      this.rotationAngle = 0;
    } else if (this.expansionTarget === 'IMAGE' && this.pendingImageOrigins) {
      syncCountTo(this.particles, this.pendingImageOrigins.length, this.portalCenter);
      
      for (let i = 0; i < this.particles.length; i++) {
        const point = this.pendingImageOrigins[i];
        const particle = this.particles[i];
        particle.targetX = point.x;
        particle.targetY = point.y;
        particle.baseSize = CONFIG.particleSize;
        particle.size = CONFIG.particleSize;
        particle.x = this.portalCenter.x;
        particle.y = this.portalCenter.y;
        particle.velocityX = 0;
        particle.velocityY = 0;
        particle.renderDepth = 1;
      }
      
      this.lastImageOrigins = this.pendingImageOrigins.map((point) => ({
        x: point.x,
        y: point.y,
      }));
      this.pendingImageOrigins = null;
    }
    
    this.state = 'EXPANDING';
  };

  private handleExpansionComplete = (): void => {
    if (this.expansionTarget === 'GLOBE') {
      this.state = 'ROTATING_GLOBE';
      this.clearTimer();
      this.timer = setTimeout(() => {
        if (this.state === 'ROTATING_GLOBE') {
          void this.prepareNextImage();
        }
      }, CONFIG.globeHoldTimeMs);
    } else if (this.expansionTarget === 'IMAGE') {
      this.state = 'IDLE';
      this.scheduleNextCycle();
    }
  };

  private prepareNextImage = async (): Promise<void> => {
    this.currentIndex++;
    const url = this.getCurrentImageUrl();
    const points = await prepareNextImage(url, window.innerWidth, window.innerHeight);

    if (this.state !== 'ROTATING_GLOBE') return;

    this.pendingImageOrigins = points ? points : this.lastImageOrigins;
    this.state = 'COLLAPSING';
    this.expansionTarget = 'IMAGE';
    this.transitionScale = 1;
  };

  private triggerBlast = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;
    if (this.state === 'BLASTING') return;

    const wasGlobe = this.state !== 'IDLE';

    if (wasGlobe && this.lastImageOrigins.length > 0) {
      syncCountTo(this.particles, this.lastImageOrigins.length, this.portalCenter);
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].targetX = this.lastImageOrigins[i].x;
        this.particles[i].targetY = this.lastImageOrigins[i].y;
        this.particles[i].baseSize = CONFIG.particleSize;
        this.particles[i].size = CONFIG.particleSize;
        this.particles[i].renderDepth = 1;
      }
      this.transitionScale = 1;
    }

    this.pendingImageOrigins = null;
    this.state = 'BLASTING';
    this.clearTimer();

    const maxSpeed = window.innerWidth / 15;
    for (const particle of this.particles) {
      applyBlastImpulse(particle, maxSpeed);
    }

    this.timer = setTimeout(() => {
      this.state = 'IDLE';
      this.scheduleNextCycle();
    }, CONFIG.blastRecoveryMs);
  };

  private animate = (): void => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.context.clearRect(0, 0, width, height);

    const color = document.documentElement.classList.contains('dark')
      ? '#ffffff'
      : '#000000';

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

    const isGlobeShape = 
      this.state === 'ROTATING_GLOBE' || 
      (this.state === 'EXPANDING' && this.expansionTarget === 'GLOBE') || 
      (this.state === 'COLLAPSING' && this.expansionTarget === 'IMAGE');

    const isRotating = 
      this.state === 'ROTATING_GLOBE' || 
      (this.state === 'EXPANDING' && this.expansionTarget === 'GLOBE');

    if (isRotating) {
      this.rotationAngle += CONFIG.globeRotationSpeed;
    }

    const isTransitioning = this.state === 'COLLAPSING' || this.state === 'EXPANDING';
    let currentEase = CONFIG.ease;
    if (isTransitioning) {
      currentEase = CONFIG.transitionEase;
    } else if (isGlobeShape) {
      currentEase = 0.15;
    }

    for (const particle of this.particles) {
      if (isRotating) {
        const rotated = rotateAroundY(particle, this.rotationAngle);
        const depth = depthFactor(rotated.z);
        particle.targetX = this.portalCenter.x + rotated.x * CONFIG.globeRadius;
        particle.targetY = this.portalCenter.y + rotated.y * CONFIG.globeRadius;
        particle.size = Math.max(0.8, particle.baseSize * depthScale(depth, 0.6));
        particle.renderDepth = depth;
      } else if (!isGlobeShape) {
        particle.renderDepth = 1;
        particle.size = particle.baseSize;
      }

      particle.originX = this.portalCenter.x + (particle.targetX - this.portalCenter.x) * this.transitionScale;
      particle.originY = this.portalCenter.y + (particle.targetY - this.portalCenter.y) * this.transitionScale;

      if (this.state !== 'BLASTING') applyAttraction(particle, currentEase);
      applyHover(particle, this.pointer);
      integrate(particle, this.state === 'BLASTING');
    }

    drawParticles(this.context, this.particles, color, isGlobeShape);

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private onMouseMove = (event: MouseEvent): void => {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.active = true;
  };

  private onMouseLeave = (): void => {
    this.pointer.active = false;
  };

  private onTouchMove = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (!touch) return;
    this.pointer.x = touch.clientX;
    this.pointer.y = touch.clientY;
    this.pointer.active = true;
  };

  private onTouchEnd = (): void => {
    this.pointer.active = false;
  };

  private setupEvents = (): void => {
    window.addEventListener('resize', this.resizeCanvas);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseleave', this.onMouseLeave);
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd);
    window.addEventListener('click', this.triggerBlast);

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          this.currentIndex = 0;
          void this.loadInitialImage();
          break;
        }
      }
    });
    this.observer.observe(document.documentElement, { attributes: true });
  };

  public destroy = (): void => {
    this.clearTimer();
    cancelAnimationFrame(this.animationFrameId);

    window.removeEventListener('resize', this.resizeCanvas);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseleave', this.onMouseLeave);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('click', this.triggerBlast);

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  };
}