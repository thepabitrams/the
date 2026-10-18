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
  const deltaX = particle.x - pointer.x;
  const deltaY = particle.y - pointer.y;
  const radiusSquared = CONFIG.hoverRadius * CONFIG.hoverRadius;
  const distanceSquared = deltaX * deltaX + deltaY * deltaY;
  if (distanceSquared === 0 || distanceSquared >= radiusSquared) return;

  const distance = Math.sqrt(distanceSquared);
  const force = (CONFIG.hoverRadius - distance) / CONFIG.hoverRadius;
  particle.velocityX += (deltaX / distance) * force * CONFIG.hoverForce;
  particle.velocityY += (deltaY / distance) * force * CONFIG.hoverForce;
}

export function integrate(particle: Particle, isBlasting: boolean): void {
  const friction = isBlasting ? CONFIG.frictionBlast : CONFIG.frictionIdle;
  particle.velocityX *= friction;
  particle.velocityY *= friction;
  particle.x += particle.velocityX;
  particle.y += particle.velocityY;
}

export function applyBoundaries(particle: Particle, width: number, height: number): void {
  const size = particle.size;
  
  if (particle.x - size < 0) {
    particle.x = size;
    particle.velocityX *= -0.4;
  } else if (particle.x + size > width) {
    particle.x = width - size;
    particle.velocityX *= -0.4;
  }

  if (particle.y - size < 0) {
    particle.y = size;
    particle.velocityY *= -0.4;
  } else if (particle.y + size > height) {
    particle.y = height - size;
    particle.velocityY *= -0.4;
  }
}

export function applyBlastImpulse(particle: Particle, maxSpeed: number): void {
  const angle = Math.random() * Math.PI * 2;
  const speed = maxSpeed * (0.5 + Math.random() * 0.5);
  particle.velocityX = Math.cos(angle) * speed;
  particle.velocityY = Math.sin(angle) * speed;
}