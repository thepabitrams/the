export class CanvasManager {
  public localCanvas: HTMLCanvasElement;
  public localContext: CanvasRenderingContext2D;
  public blastCanvas: HTMLCanvasElement;
  public blastContext: CanvasRenderingContext2D;
  
  public portalCenter = { x: 0, y: 0 };
  public anchorSize = 300;
  private anchorId: string;

  constructor(localCanvas: HTMLCanvasElement, blastCanvas: HTMLCanvasElement, anchorId: string) {
    this.localCanvas = localCanvas;
    this.localContext = localCanvas.getContext('2d')!;
    this.blastCanvas = blastCanvas;
    this.blastContext = blastCanvas.getContext('2d')!;
    this.anchorId = anchorId;
    this.resizeLocal();
  }

  public resizeLocal(): void {
    const anchor = document.getElementById(this.anchorId);
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    
    this.localCanvas.width = Math.floor(rect.width * ratio);
    this.localCanvas.height = Math.floor(rect.height * ratio);
    this.localContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    
    this.anchorSize = Math.min(rect.width, rect.height);
    this.portalCenter = { x: rect.width / 2, y: rect.height / 2 };
  }

  public resizeBlast(): void {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.blastCanvas.width = Math.floor(window.innerWidth * ratio);
    this.blastCanvas.height = Math.floor(window.innerHeight * ratio);
    this.blastContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  public getAnchorRect(): DOMRect {
    const anchor = document.getElementById(this.anchorId);
    return anchor ? anchor.getBoundingClientRect() : new DOMRect();
  }

  public switchToBlastView(): void {
    this.resizeBlast();
    this.localCanvas.style.display = 'none';
    this.blastCanvas.style.display = 'block';
  }

  public switchToLocalView(): void {
    this.blastCanvas.style.display = 'none';
    this.localCanvas.style.display = 'block';
    this.resizeLocal();
  }

  public clearLocal(): void {
    this.localContext.clearRect(0, 0, this.localCanvas.width, this.localCanvas.height);
  }

  public clearBlast(): void {
    this.blastContext.clearRect(0, 0, this.blastCanvas.width, this.blastCanvas.height);
  }
}