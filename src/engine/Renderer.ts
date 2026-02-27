import type { RayHit } from './types';
import { TextureManager } from './TextureManager';
import { SCREEN_WIDTH, SCREEN_HEIGHT, TEX_WIDTH, TEX_HEIGHT } from '../constants';

export class Renderer {
  private imageData: ImageData;
  private buf: Uint32Array;
  public zBuffer: number[];
  private ctx: CanvasRenderingContext2D;
  private textures: TextureManager;

  constructor(
    ctx: CanvasRenderingContext2D,
    textures: TextureManager
  ) {
    this.ctx = ctx;
    this.textures = textures;
    this.imageData = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.buf = new Uint32Array(this.imageData.data.buffer);
    this.zBuffer = new Array(SCREEN_WIDTH);
  }

  renderFrame(hits: RayHit[]): void {
    this.drawCeilingAndFloor();
    this.drawWalls(hits);
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  private drawCeilingAndFloor(): void {
    const halfH = SCREEN_HEIGHT / 2;
    for (let y = 0; y < SCREEN_HEIGHT; y++) {
      const dist = y < halfH
        ? halfH / (halfH - y)
        : halfH / (y - halfH + 1);
      const fogFactor = Math.min(1, dist / 14);
      const offset = y * SCREEN_WIDTH;

      if (y < halfH) {
        const base = 25;
        const r = Math.floor(base * (1 - fogFactor * 0.7));
        const g = Math.floor(base * (1 - fogFactor * 0.7));
        const b = Math.floor((base + 15) * (1 - fogFactor * 0.5));
        const color = (255 << 24) | (b << 16) | (g << 8) | r;
        for (let x = 0; x < SCREEN_WIDTH; x++) {
          this.buf[offset + x] = color;
        }
      } else {
        const base = 20;
        const r = Math.floor(base * (1 - fogFactor * 0.8));
        const g = Math.floor((base + 5) * (1 - fogFactor * 0.8));
        const b = Math.floor(base * (1 - fogFactor * 0.8));
        const color = (255 << 24) | (b << 16) | (g << 8) | r;
        for (let x = 0; x < SCREEN_WIDTH; x++) {
          this.buf[offset + x] = color;
        }
      }
    }
  }

  private drawWalls(hits: RayHit[]): void {
    for (let x = 0; x < hits.length; x++) {
      const hit = hits[x];
      this.zBuffer[x] = hit.distance;

      const lineHeight = Math.floor(SCREEN_HEIGHT / hit.distance);
      const drawStart = Math.max(0, Math.floor(-lineHeight / 2 + SCREEN_HEIGHT / 2));
      const drawEnd = Math.min(SCREEN_HEIGHT - 1, Math.floor(lineHeight / 2 + SCREEN_HEIGHT / 2));

      let texX = Math.floor(hit.wallX * TEX_WIDTH);
      if (texX >= TEX_WIDTH) texX = TEX_WIDTH - 1;

      const step = TEX_HEIGHT / lineHeight;
      let texPos = (drawStart - SCREEN_HEIGHT / 2 + lineHeight / 2) * step;

      for (let y = drawStart; y <= drawEnd; y++) {
        const texY = Math.floor(texPos) & (TEX_HEIGHT - 1);
        texPos += step;

        let [r, g, b] = this.textures.getPixel(hit.tileType, texX, texY);

        if (hit.side === 1) {
          r = r >> 1;
          g = g >> 1;
          b = b >> 1;
        }

        const fogFactor = Math.min(1, hit.distance / 12);
        r = Math.floor(r * (1 - fogFactor));
        g = Math.floor(g * (1 - fogFactor));
        b = Math.floor(b * (1 - fogFactor));

        this.buf[y * SCREEN_WIDTH + x] = (255 << 24) | (b << 16) | (g << 8) | r;
      }
    }
  }
}
