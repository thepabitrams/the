export class CanvasManager {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public portalCenter = { x: 0, y: 0 };
  private anchorId: string;

  constructor(canvas: HTMLCanvasElement, anchorId: string) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.anchorId = anchorId;
    this.updateCenter();
  }

  public resize(): void {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.canvas.width = Math.floor(window.innerWidth * ratio);
    this.canvas.height = Math.floor(window.innerHeight * ratio);
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.updateCenter();
  }

  public updateCenter(): void {
    const anchor = document.getElementById(this.anchorId);
    if (anchor) {
      const rect = anchor.getBoundingClientRect();
      this.portalCenter = { 
        x: rect.left + rect.width / 2, 
        y: rect.top + rect.height / 2 
      };
    } else {
      this.portalCenter = { 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
      };
    }
  }

  public clear(): void {
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}