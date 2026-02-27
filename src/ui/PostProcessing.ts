import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

export class PostProcessing {
  private enabled = true;
  private scanlinePattern: CanvasPattern | null = null;

  constructor(ctx: CanvasRenderingContext2D) {
    const scanlineCanvas = new OffscreenCanvas(SCREEN_WIDTH, 4);
    const sctx = scanlineCanvas.getContext('2d')!;
    sctx.clearRect(0, 0, SCREEN_WIDTH, 4);
    sctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    sctx.fillRect(0, 2, SCREEN_WIDTH, 2);
    this.scanlinePattern = ctx.createPattern(scanlineCanvas, 'repeat');
  }

  toggle(): void {
    this.enabled = !this.enabled;
  }

  apply(ctx: CanvasRenderingContext2D): void {
    if (!this.enabled) return;

    ctx.save();

    // Scanlines
    if (this.scanlinePattern) {
      ctx.fillStyle = this.scanlinePattern;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }

    // Vignette
    const gradient = ctx.createRadialGradient(
      SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_WIDTH * 0.3,
      SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_WIDTH * 0.7
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.restore();
  }
}
