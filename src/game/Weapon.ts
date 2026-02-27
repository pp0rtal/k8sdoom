import { SCREEN_WIDTH, SCREEN_HEIGHT, WEAPON_COOLDOWN } from '../constants';

export type WeaponState = 'idle' | 'firing' | 'cooldown';

export class Weapon {
  state: WeaponState = 'idle';
  private animTimer = 0;
  private bobPhase = 0;
  private recoilOffset = 0;

  update(dt: number, isMoving: boolean): void {
    if (isMoving) {
      this.bobPhase += dt * 8;
    }

    switch (this.state) {
      case 'firing':
        this.animTimer -= dt;
        this.recoilOffset = Math.max(0, this.animTimer / 0.1) * 20;
        if (this.animTimer <= 0) {
          this.state = 'cooldown';
          this.animTimer = WEAPON_COOLDOWN / 1000;
        }
        break;
      case 'cooldown':
        this.animTimer -= dt;
        this.recoilOffset = 0;
        if (this.animTimer <= 0) {
          this.state = 'idle';
        }
        break;
    }
  }

  fire(): boolean {
    if (this.state !== 'idle') return false;
    this.state = 'firing';
    this.animTimer = 0.1;
    return true;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const bobX = Math.sin(this.bobPhase) * 4;
    const bobY = Math.abs(Math.cos(this.bobPhase)) * 4;
    const baseX = SCREEN_WIDTH / 2 - 40 + bobX;
    const baseY = SCREEN_HEIGHT - 120 + bobY + this.recoilOffset;

    ctx.save();

    // Weapon body
    ctx.fillStyle = '#222';
    ctx.beginPath();
    this.roundedRect(ctx, baseX, baseY, 80, 100, 6);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.roundedRect(ctx, baseX, baseY, 80, 100, 6);
    ctx.stroke();

    // Screen area
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(baseX + 8, baseY + 8, 64, 44);

    // Terminal text
    ctx.fillStyle = '#00ff00';
    ctx.font = '8px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('$ kubectl', baseX + 12, baseY + 22);
    ctx.fillText('  delete pod', baseX + 12, baseY + 34);
    ctx.fillStyle = '#00aa00';
    ctx.fillText('  --force', baseX + 12, baseY + 46);

    // Barrel
    ctx.fillStyle = '#444';
    ctx.fillRect(baseX + 30, baseY - 10, 20, 15);
    ctx.fillStyle = '#333';
    ctx.fillRect(baseX + 33, baseY - 8, 14, 11);

    // Muzzle flash when firing
    if (this.state === 'firing') {
      ctx.fillStyle = '#ffaa00';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(baseX + 40, baseY - 15, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(baseX + 40, baseY - 15, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  private roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
