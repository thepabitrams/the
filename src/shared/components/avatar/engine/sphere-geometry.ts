export interface SphereBasis {
  baseX: number;
  baseY: number;
  baseZ: number;
}

export interface RotatedPoint {
  x: number;
  y: number;
  z: number;
}

export function buildFibonacciSphere(count: number): SphereBasis[] {
  const result: SphereBasis[] = [];
  if (count <= 0) return result;
  if (count === 1) return [{ baseX: 0, baseY: 0, baseZ: 0 }];

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    result.push({
      baseX: Math.cos(theta) * radius,
      baseY: y,
      baseZ: Math.sin(theta) * radius,
    });
  }
  return result;
}

export function rotateAroundY(point: SphereBasis, angle: number): RotatedPoint {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return {
    x: point.baseX * cosine - point.baseZ * sine,
    y: point.baseY,
    z: point.baseX * sine + point.baseZ * cosine,
  };
}

export function depthFactor(depthCoordinate: number): number {
  return (depthCoordinate + 1) / 2;
}

export function depthScale(depth: number, minimumScale = 0.6): number {
  return minimumScale + (1 - minimumScale) * depth;
}