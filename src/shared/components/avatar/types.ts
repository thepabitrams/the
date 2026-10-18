export interface Point {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  size: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  baseSize: number;
  renderDepth: number;
}

export type EngineState =
  | 'IDLE'
  | 'COLLAPSING'
  | 'EXPANDING'
  | 'ROTATING_GLOBE'
  | 'BLASTING';