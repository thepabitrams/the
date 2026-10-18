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
  
  const path = new Path2D();
  
  for (const particle of particles) {
    if (particle.size <= 0.1) continue;
    path.moveTo(particle.x + particle.size, particle.y);
    path.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  }
  
  context.fill(path);
}