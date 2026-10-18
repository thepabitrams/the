import type { Particle } from '../types';

export function drawParticles(
  context: CanvasRenderingContext2D,
  particles: Particle[],
  color: string,
  sortByDepth: boolean
): void {
  if (sortByDepth) {
    particles.sort((a, b) => a.renderDepth - b.renderDepth);
  }

  context.fillStyle = color;
  
  for (const particle of particles) {
    if (particle.size <= 0.1) continue;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();
  }
}