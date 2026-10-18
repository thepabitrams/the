import { CONFIG } from '../config';
import type { Particle, Point } from '../types';
import { syncCountTo, getDynamicParticleSize } from './particle-factory';
import { buildFibonacciSphere, rotateAroundY } from './sphere-geometry';

export class MorphManager {
  public static prepareGlobe(
    particles: Particle[], 
    portalCenter: { x: number, y: number }
  ): void {
    const currentRadius = window.innerWidth < 768 ? CONFIG.globeRadius * 0.6 : CONFIG.globeRadius;
    const dynamicSize = getDynamicParticleSize();

    syncCountTo(particles, CONFIG.globeParticleCount, portalCenter);
    const bases = buildFibonacciSphere(particles.length);
    
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      const basis = bases[i];
      particle.baseX = basis.baseX;
      particle.baseY = basis.baseY;
      particle.baseZ = basis.baseZ;
      particle.baseSize = dynamicSize;
      
      const rotated = rotateAroundY(particle, 0);
      particle.targetX = portalCenter.x + rotated.x * currentRadius;
      particle.targetY = portalCenter.y + rotated.y * currentRadius;
      particle.x = portalCenter.x;
      particle.y = portalCenter.y;
      particle.velocityX = 0;
      particle.velocityY = 0;
    }
  }

  public static prepareImage(
    particles: Particle[], 
    points: Point[], 
    portalCenter: { x: number, y: number }
  ): void {
    const dynamicSize = getDynamicParticleSize();
    syncCountTo(particles, points.length, portalCenter);
    
    for (let i = 0; i < particles.length; i++) {
      const point = points[i];
      const particle = particles[i];
      particle.targetX = point.x;
      particle.targetY = point.y;
      particle.baseSize = dynamicSize;
      particle.size = dynamicSize;
      particle.x = portalCenter.x;
      particle.y = portalCenter.y;
      particle.velocityX = 0;
      particle.velocityY = 0;
      particle.renderDepth = 1;
    }
  }
}