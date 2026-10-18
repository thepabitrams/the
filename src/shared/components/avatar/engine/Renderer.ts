import type { Particle } from '../types';

export function drawParticles(
  context: CanvasRenderingContext2D,
  particles: Particle[],
  color: string,
  sortByDepth: boolean
): void {
  const ordered = sortByDepth
    ? [...particles].sort((a, b) => a.renderDepth - b.renderDepth)
    : particles;

  context.fillStyle = color;
  for (const particle of ordered) {
    if (particle.size <= 0.1) continue;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();
  }
}