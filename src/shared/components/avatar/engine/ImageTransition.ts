import { extractPointsFromImage } from '../ImageUtils';
import type { Point } from '../types';

export async function prepareNextImage(
  url: string,
  viewportWidth: number,
  viewportHeight: number,
  centerX: number,
  centerY: number
): Promise<Point[] | null> {
  const points = await extractPointsFromImage(url, viewportWidth, viewportHeight, centerX, centerY);
  if (points.length === 0) return null;
  return points;
}