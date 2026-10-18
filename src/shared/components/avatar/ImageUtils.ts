import { CONFIG } from './config';
import type { Point } from './types';

export const extractPointsFromImage = async (
  url: string,
  anchorSize: number,
  centerX: number,
  centerY: number
): Promise<Point[]> => {
  const supersampleScale = 2;
  const renderSize = anchorSize * supersampleScale;
  
  const dynamicGap = Math.max(2, Math.min(4, Math.round(anchorSize / 150)));
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return [];

  canvas.width = Math.floor(renderSize);
  canvas.height = Math.floor(renderSize);

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

  const offsetX = centerX - (canvas.width / supersampleScale) / 2;
  const offsetY = centerY - (canvas.height / supersampleScale) / 2;
  
  const points: Point[] = [];
  const data = imageData.data;

  for (let y = 0; y < canvas.height; y += dynamicGap) {
    for (let x = 0; x < canvas.width; x += dynamicGap) {
      const index = (y * canvas.width + x) * 4;
      const alpha = data[index + 3];

      if (alpha > CONFIG.alphaThreshold) {
        points.push({
          x: (x / supersampleScale) + offsetX + (Math.random() - 0.5) * CONFIG.jitter,
          y: (y / supersampleScale) + offsetY + (Math.random() - 0.5) * CONFIG.jitter,
        });
      }
    }
  }

  return points;
};