import { extractPointsFromImage } from '../ImageUtils';
import type { Point } from '../types';

export async function prepareNextImage(
  url: string,
  viewportWidth: number,
  viewportHeight: number
): Promise<Point[] | null> {
  const points = await extractPointsFromImage(url, viewportWidth, viewportHeight);
  if (points.length === 0) return null;
  return points;
}