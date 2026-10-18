import { CONFIG } from '../config';
import type { Particle, Point } from '../types';

export const getDynamicParticleSize = (): number => {
  if (typeof window === 'undefined') return CONFIG.particleSize;
  
  const screenRatio = window.innerWidth / CONFIG.referenceScreenWidth;
  const safeRatio = Math.max(0.4, Math.min(2, screenRatio));
  return Math.max(0.8, CONFIG.particleSize * safeRatio);
};

export function createParticle(x: number, y: number): Particle {
  const size = getDynamicParticleSize();
  return {
    x,
    y,
    originX: x,
    originY: y,
    targetX: x,
    targetY: y,
    velocityX: 0,
    velocityY: 0,
    size,
    baseX: 0,
    baseY: 0,
    baseZ: 0,
    baseSize: size,
    renderDepth: 1,
  };
}

export function createParticlesFromPoints(points: Point[]): Particle[] {
  return points.map((point) => createParticle(point.x, point.y));
}

export function syncCountTo(
  particles: Particle[],
  targetCount: number,
  spawn: { x: number; y: number }
): void {
  if (particles.length > targetCount) {
    particles.length = targetCount;
    return;
  }
  
  while (particles.length < targetCount) {
    particles.push(createParticle(spawn.x, spawn.y));
  }
}