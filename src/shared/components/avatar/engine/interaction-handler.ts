import type { PointerState } from './physics';

export interface InteractionCallbacks {
  onHover: (pointer: PointerState) => void;
  onBlast: () => void;
  onResize: () => void;
  onScroll: () => void;
  onThemeChange: () => void;
}

export class InteractionHandler {
  private callbacks: InteractionCallbacks;
  
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private pointerDownPosition = { x: 0, y: 0 };
  private isLongPressHandled = false;
  private isPointerOnUI = false;
  private observer: MutationObserver | null = null;

  constructor(callbacks: InteractionCallbacks) {
    this.callbacks = callbacks;
  }

  public init(): void {
    window.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('resize', this.callbacks.onResize);
    window.addEventListener('scroll', this.callbacks.onScroll, { passive: true });

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
    const target = event.target as HTMLElement;
    this.isPointerOnUI = !!target?.closest('a, button');
    if (this.isPointerOnUI) return;

    this.isLongPressHandled = false;
    this.pointerDownPosition = { x: event.clientX, y: event.clientY };

    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    
    this.longPressTimer = setTimeout(() => {
      this.isLongPressHandled = true;
      this.callbacks.onHover({ x: this.pointerDownPosition.x, y: this.pointerDownPosition.y, active: true });
    }, 350);
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (this.isPointerOnUI) return;

    if (event.pointerType === 'mouse') {
      this.callbacks.onHover({ x: event.clientX, y: event.clientY, active: true });
      return;
    }

    if (this.longPressTimer) {
      const distanceX = Math.abs(event.clientX - this.pointerDownPosition.x);
      const distanceY = Math.abs(event.clientY - this.pointerDownPosition.y);
      
      if (distanceX > 10 || distanceY > 10) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
        this.isLongPressHandled = true;
      }
    }

    if (this.isLongPressHandled) {
      this.callbacks.onHover({ x: event.clientX, y: event.clientY, active: true });
    }
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (this.isPointerOnUI) {
      this.isPointerOnUI = false;
      return;
    }

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    
    this.callbacks.onHover({ x: -9999, y: -9999, active: false });

    if (!this.isLongPressHandled) {
      this.callbacks.onBlast();
    }
  };

  public destroy = (): void => {
    if (this.longPressTimer) clearTimeout(this.longPressTimer);
    
    window.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('resize', this.callbacks.onResize);
    window.removeEventListener('scroll', this.callbacks.onScroll);

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  };
}