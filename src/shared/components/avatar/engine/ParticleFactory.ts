import { CONFIG } from '../config';
import type { Particle, Point } from '../types';

const defaultSize = (): number => CONFIG.particleSize;

export function createParticle(x: number, y: number): Particle {
  const size = defaultSize();
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
    const p = createParticle(spawn.x, spawn.y);
    p.x = spawn.x;
    p.y = spawn.y;
    p.targetX = spawn.x;
    p.targetY = spawn.y;
    p.originX = spawn.x;
    p.originY = spawn.y;
    particles.push(p);
  }
}