import { extractPointsFromImage } from '../ImageUtils';
import type { Point } from '../types';

export async function prepareNextImage(
  url: string,
  anchorSize: number,
  centerX: number,
  centerY: number
): Promise<Point[] | null> {
  const points = await extractPointsFromImage(url, anchorSize, centerX, centerY);
  if (points.length === 0) return null;
  return points;
}