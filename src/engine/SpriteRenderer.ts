import { Camera } from './Camera';
import { Enemy } from '../game/Enemy';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

interface SpriteRenderData {
  screenX: number;
  transformY: number;
  spriteHeight: number;
  spriteWidth: number;
  drawStartX: number;
  drawEndX: number;
  drawStartY: number;
  drawEndY: number;
  entity: Enemy;
}

export class SpriteRenderer {
  private spriteBuffer: OffscreenCanvas;
  private spriteCtx: OffscreenCanvasRenderingContext2D;

  constructor() {
    this.spriteBuffer = new OffscreenCanvas(64, 64);
    this.spriteCtx = this.spriteBuffer.getContext('2d')!;
  }

  renderSprites(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    enemies: Enemy[],
    zBuffer: number[]
  ): void {
    const sprites: SpriteRenderData[] = [];
    for (const enemy of enemies) {
      if (!enemy.alive && enemy.deathTimer <= 0) continue;
      const data = this.computeSpriteData(camera, enemy);
      if (data) sprites.push(data);
    }

    sprites.sort((a, b) => b.transformY - a.transformY);

    for (const sprite of sprites) {
      this.drawSprite(ctx, sprite, zBuffer);
    }
  }

  private computeSpriteData(camera: Camera, enemy: Enemy): SpriteRenderData | null {
    const spriteX = enemy.pos.x - camera.pos.x;
    const spriteY = enemy.pos.y - camera.pos.y;

    const invDet = 1.0 / (camera.plane.x * camera.dir.y - camera.dir.x * camera.plane.y);
    const transformX = invDet * (camera.dir.y * spriteX - camera.dir.x * spriteY);
    const transformY = invDet * (-camera.plane.y * spriteX + camera.plane.x * spriteY);

    if (transformY <= 0.1) return null;

    const screenX = Math.floor((SCREEN_WIDTH / 2) * (1 + transformX / transformY));
    const spriteHeight = Math.abs(Math.floor(SCREEN_HEIGHT / transformY));
    const spriteWidth = spriteHeight;

    const drawStartY = Math.max(0, Math.floor(-spriteHeight / 2 + SCREEN_HEIGHT / 2));
    const drawEndY = Math.min(SCREEN_HEIGHT - 1, Math.floor(spriteHeight / 2 + SCREEN_HEIGHT / 2));
    const drawStartX = Math.max(0, Math.floor(-spriteWidth / 2 + screenX));
    const drawEndX = Math.min(SCREEN_WIDTH - 1, Math.floor(spriteWidth / 2 + screenX));

    return { screenX, transformY, spriteHeight, spriteWidth, drawStartX, drawEndX, drawStartY, drawEndY, entity: enemy };
  }

  private drawSprite(
    ctx: CanvasRenderingContext2D,
    sprite: SpriteRenderData,
    zBuffer: number[]
  ): void {
    this.renderCronJobTexture(sprite.entity);

    const spriteLeftX = sprite.screenX - sprite.spriteWidth / 2;
    const destHeight = sprite.drawEndY - sprite.drawStartY;

    for (let x = sprite.drawStartX; x <= sprite.drawEndX; x++) {
      if (sprite.transformY < zBuffer[x]) {
        const texX = Math.floor((x - spriteLeftX) / sprite.spriteWidth * 64);
        if (texX >= 0 && texX < 64) {
          ctx.drawImage(
            this.spriteBuffer,
            texX, 0, 1, 64,
            x, sprite.drawStartY, 1, destHeight
          );
        }
      }
    }
  }

  private renderCronJobTexture(enemy: Enemy): void {
    const ctx = this.spriteCtx;
    ctx.clearRect(0, 0, 64, 64);

    const baseColor = !enemy.alive ? '#555' : enemy.health > 15 ? '#326CE5' : '#CC0000';
    ctx.fillStyle = baseColor;
    this.roundRect(ctx, 4, 4, 56, 56, 8);
    ctx.fill();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(32, 20, 9, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(32 + Math.cos(angle) * 4, 20 + Math.sin(angle) * 4);
      ctx.lineTo(32 + Math.cos(angle) * 9, 20 + Math.sin(angle) * 9);
      ctx.stroke();
    }

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CronJob', 32, 44);

    ctx.font = '7px monospace';
    ctx.fillStyle = '#aaddff';
    ctx.fillText(enemy.cronExpression, 32, 56);
  }

  private roundRect(ctx: OffscreenCanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    ctx.beginPath();
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
