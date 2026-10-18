import { CONFIG } from './config';
import type { Point } from './types';

export const extractPointsFromImage = async (
  url: string,
  viewportWidth: number,
  viewportHeight: number
): Promise<Point[]> => {
  const shapeSize = Math.min(viewportWidth, viewportHeight) * 0.55;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return [];

  canvas.width = Math.floor(shapeSize);
  canvas.height = Math.floor(shapeSize);

  const imageData = await new Promise<ImageData | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      const aspectRatio = img.width / img.height;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let drawX = 0;
      let drawY = 0;

      if (aspectRatio > 1) {
        drawHeight = canvas.width / aspectRatio;
        drawY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * aspectRatio;
        drawX = (canvas.width - drawWidth) / 2;
      }

      context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      
      try {
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });

  if (!imageData) return [];

  const offsetX = viewportWidth * 0.25 - canvas.width / 2;
  const offsetY = viewportHeight / 2 - canvas.height / 2;
  const points: Point[] = [];
  const data = imageData.data;

  for (let y = 0; y < canvas.height; y += CONFIG.imageGap) {
    for (let x = 0; x < canvas.width; x += CONFIG.imageGap) {
      const index = (y * canvas.width + x) * 4;
      const alpha = data[index + 3];

      if (alpha > CONFIG.alphaThreshold) {
        points.push({
          x: x + offsetX + (Math.random() - 0.5) * CONFIG.jitter,
          y: y + offsetY + (Math.random() - 0.5) * CONFIG.jitter,
        });
      }
    }
  }

  return points;
};