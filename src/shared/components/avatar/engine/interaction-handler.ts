import type { PointerState } from './physics';

export interface InteractionCallbacks {
  onHover: (pointer: PointerState) => void;
  onBlast: () => void;
  onResize: () => void;
  onThemeChange: () => void;
}

export class InteractionHandler {
  private callbacks: InteractionCallbacks;
  private localCanvas: HTMLCanvasElement;
  
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private pointerDownPosition = { x: 0, y: 0 };
  private isLongPressHandled = false;
  private isAborted = false;
  private isPointerDown = false;
  private observer: MutationObserver | null = null;

  constructor(localCanvas: HTMLCanvasElement, callbacks: InteractionCallbacks) {
    this.localCanvas = localCanvas;
    this.callbacks = callbacks;
  }

  public init(): void {
    this.localCanvas.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerCancel);
    window.addEventListener('resize', this.callbacks.onResize);

    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          this.callbacks.onThemeChange();
          break;
        }
      }
    });
    this.observer.observe(document.documentElement, { attributes: true });
  }

  private onPointerDown = (event: PointerEvent): void => {
    this.isPointerDown = true;
    this.isLongPressHandled = false;
    this.isAborted = false;
    this.pointerDownPosition = { x: event.clientX, y: event.clientY };

    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    
    this.longPressTimer = setTimeout(() => {
      this.isLongPressHandled = true;
      this.callbacks.onHover({ x: event.clientX, y: event.clientY, active: true });
    }, 350);
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (this.isAborted) return;

    if (event.pointerType === 'mouse') {
      this.callbacks.onHover({ x: event.clientX, y: event.clientY, active: true });
      return;
    }

    if (!this.isPointerDown) return;

    const distanceX = Math.abs(event.clientX - this.pointerDownPosition.x);
    const distanceY = Math.abs(event.clientY - this.pointerDownPosition.y);
    
    if (distanceX > 10 || distanceY > 10) {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
      this.isAborted = true;
      this.isLongPressHandled = false;
      this.callbacks.onHover({ x: -9999, y: -9999, active: false });
      return;
    }

    if (this.isLongPressHandled) {
      this.callbacks.onHover({ x: event.clientX, y: event.clientY, active: true });
    }
  };

  private onPointerUp = (): void => {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    
    this.callbacks.onHover({ x: -9999, y: -9999, active: false });

    if (!this.isLongPressHandled && !this.isAborted) {
      this.callbacks.onBlast();
    }
  };

  private onPointerCancel = (): void => {
    this.isPointerDown = false;

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.isAborted = true;
    this.isLongPressHandled = false;
    this.callbacks.onHover({ x: -9999, y: -9999, active: false });
  };

  public destroy = (): void => {
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    
    this.localCanvas.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerCancel);
    window.removeEventListener('resize', this.callbacks.onResize);

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  };
}