import { CONFIG } from '../config';
import type { Particle } from '../types';

export interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

export function applyAttraction(particle: Particle, ease: number): void {
  particle.velocityX += (particle.originX - particle.x) * ease;
  particle.velocityY += (particle.originY - particle.y) * ease;
}

export function applyHover(particle: Particle, pointer: PointerState): void {
  if (!pointer.active) return;
  const dx = particle.x - pointer.x;
  const dy = particle.y - pointer.y;
  const radiusSquared = CONFIG.hoverRadius * CONFIG.hoverRadius;
  const distanceSquared = dx * dx + dy * dy;
  if (distanceSquared === 0 || distanceSquared >= radiusSquared) return;

  const distance = Math.sqrt(distanceSquared);
  const force = (CONFIG.hoverRadius - distance) / CONFIG.hoverRadius;
  particle.velocityX += (dx / distance) * force * CONFIG.hoverForce;
  particle.velocityY += (dy / distance) * force * CONFIG.hoverForce;
}

export function integrate(particle: Particle, isBlasting: boolean): void {
  const friction = isBlasting ? CONFIG.frictionBlast : CONFIG.frictionIdle;
  particle.velocityX *= friction;
  particle.velocityY *= friction;
  particle.x += particle.velocityX;
  particle.y += particle.velocityY;
}

export function applyBlastImpulse(particle: Particle, maxSpeed: number): void {
  const angle = Math.random() * Math.PI * 2;
  const speed = maxSpeed * (0.5 + Math.random() * 0.5);
  particle.velocityX = Math.cos(angle) * speed;
  particle.velocityY = Math.sin(angle) * speed;
}