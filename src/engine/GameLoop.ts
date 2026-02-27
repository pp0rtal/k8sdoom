export class GameLoop {
  private lastTime = 0;
  private accumulator = 0;
  private running = false;
  private fixedDt: number;
  private updateFn: (dt: number) => void;
  private renderFn: (interpolation: number) => void;

  constructor(
    fixedDt: number,
    updateFn: (dt: number) => void,
    renderFn: (interpolation: number) => void
  ) {
    this.fixedDt = fixedDt;
    this.updateFn = updateFn;
    this.renderFn = renderFn;
  }

  start(): void {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.tick(t));
  }

  private tick(currentTime: number): void {
    if (!this.running) return;
    const frameTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    this.accumulator += frameTime;

    while (this.accumulator >= this.fixedDt) {
      this.updateFn(this.fixedDt);
      this.accumulator -= this.fixedDt;
    }

    this.renderFn(this.accumulator / this.fixedDt);
    requestAnimationFrame((t) => this.tick(t));
  }

  stop(): void {
    this.running = false;
  }
}
