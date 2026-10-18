import { CONFIG } from '../config';
import type { Particle, Point } from '../types';

export const getDynamicParticleSize = (anchorSize: number): number => {
  const dynamicGap = Math.max(2, Math.min(4, Math.round(anchorSize / 150)));
  
  const calculatedSize = dynamicGap * 0.85;
  
  return Math.max(1.2, Math.min(2.2, calculatedSize));
};

export function createParticle(x: number, y: number, anchorSize: number): Particle {
  const size = getDynamicParticleSize(anchorSize);
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

export function createParticlesFromPoints(points: Point[], anchorSize: number): Particle[] {
  return points.map((point) => createParticle(point.x, point.y, anchorSize));
}

export function syncCountTo(
  particles: Particle[],
  targetCount: number,
  spawn: { x: number; y: number },
  anchorSize: number
): void {
  if (particles.length > targetCount) {
    particles.length = targetCount;
    return;
  }
  
  while (particles.length < targetCount) {
    particles.push(createParticle(spawn.x, spawn.y, anchorSize));
  }
}