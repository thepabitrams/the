import { CONFIG } from '../config';
import type { Particle } from '../types';
import { applyBlastImpulse } from './physics';
import { getDynamicParticleSize } from './particle-factory';
import { CanvasManager } from './canvas-manager';

export class BlastManager {
  public static applyBlast(
    particles: Particle[],
    canvasManager: CanvasManager,
    targetOrigins: { x: number; y: number }[],
    onComplete: () => void
  ): ReturnType<typeof setTimeout> {
    const anchorRect = canvasManager.getAnchorRect();
    canvasManager.switchToBlastView();

    for (const particle of particles) {
      particle.x += anchorRect.left;
      particle.y += anchorRect.top;
      particle.originX += anchorRect.left;
      particle.originY += anchorRect.top;
      particle.targetX += anchorRect.left;
      particle.targetY += anchorRect.top;
    }

    const maximumSpeed = window.innerWidth / 25;
    for (const particle of particles) {
      applyBlastImpulse(particle, maximumSpeed);
    }

    return setTimeout(() => {
      canvasManager.switchToLocalView();
      const newAnchorRect = canvasManager.getAnchorRect();
      const dynamicParticleSize = getDynamicParticleSize(canvasManager.anchorSize);

      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index];
        
        particle.x -= newAnchorRect.left;
        particle.y -= newAnchorRect.top;
        
        if (targetOrigins[index]) {
          particle.targetX = targetOrigins[index].x;
          particle.targetY = targetOrigins[index].y;
        }
        
        particle.baseSize = dynamicParticleSize;
        particle.size = dynamicParticleSize;
        particle.renderDepth = 1;
      }

      onComplete();
    }, CONFIG.blastRecoveryMs);
  }
}