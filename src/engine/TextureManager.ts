import { TEX_WIDTH, TEX_HEIGHT } from '../constants';

export class TextureManager {
  private textures: Map<number, Uint8ClampedArray> = new Map();

  constructor() {
    this.generateWallTextures();
  }

  private generateWallTextures(): void {
    this.textures.set(1, this.generateBlueBrick());
    this.textures.set(2, this.generateMetalPanel());
    this.textures.set(3, this.generateCircuitBoard());
    this.textures.set(4, this.generateWarningStripes());
  }

  private generateBlueBrick(): Uint8ClampedArray {
    const data = new Uint8ClampedArray(TEX_WIDTH * TEX_HEIGHT * 4);
    const brickH = 16;
    const brickW = 32;
    for (let y = 0; y < TEX_HEIGHT; y++) {
      for (let x = 0; x < TEX_WIDTH; x++) {
        const row = Math.floor(y / brickH);
        const offset = (row % 2) * (brickW / 2);
        const bx = (x + offset) % brickW;
        const isMortar = y % brickH === 0 || bx === 0;
        const i = (y * TEX_WIDTH + x) * 4;
        if (isMortar) {
          data[i] = 30; data[i + 1] = 40; data[i + 2] = 60; data[i + 3] = 255;
        } else {
          const noise = Math.random() * 15 - 7;
          data[i] = 50 + noise;
          data[i + 1] = 108 + noise;
          data[i + 2] = 229 + Math.min(0, noise);
          data[i + 3] = 255;
        }
      }
    }
    return data;
  }

  private generateMetalPanel(): Uint8ClampedArray {
    const data = new Uint8ClampedArray(TEX_WIDTH * TEX_HEIGHT * 4);
    for (let y = 0; y < TEX_HEIGHT; y++) {
      for (let x = 0; x < TEX_WIDTH; x++) {
        const i = (y * TEX_WIDTH + x) * 4;
        const isSeam = y % 32 === 0 || x % 32 === 0;
        const isRivet = (y % 32 === 4 || y % 32 === 28) && (x % 8 === 4);
        if (isRivet) {
          data[i] = 160; data[i + 1] = 160; data[i + 2] = 170; data[i + 3] = 255;
        } else if (isSeam) {
          data[i] = 40; data[i + 1] = 40; data[i + 2] = 45; data[i + 3] = 255;
        } else {
          const noise = Math.random() * 10 - 5;
          data[i] = 80 + noise;
          data[i + 1] = 82 + noise;
          data[i + 2] = 88 + noise;
          data[i + 3] = 255;
        }
      }
    }
    return data;
  }

  private generateCircuitBoard(): Uint8ClampedArray {
    const data = new Uint8ClampedArray(TEX_WIDTH * TEX_HEIGHT * 4);
    for (let y = 0; y < TEX_HEIGHT; y++) {
      for (let x = 0; x < TEX_WIDTH; x++) {
        const i = (y * TEX_WIDTH + x) * 4;
        const isTrace = x % 8 === 0 || y % 8 === 0;
        if (isTrace) {
          data[i] = 30; data[i + 1] = 180; data[i + 2] = 30; data[i + 3] = 255;
        } else {
          const noise = Math.random() * 8 - 4;
          data[i] = 15 + noise;
          data[i + 1] = 50 + noise;
          data[i + 2] = 15 + noise;
          data[i + 3] = 255;
        }
      }
    }
    return data;
  }

  private generateWarningStripes(): Uint8ClampedArray {
    const data = new Uint8ClampedArray(TEX_WIDTH * TEX_HEIGHT * 4);
    for (let y = 0; y < TEX_HEIGHT; y++) {
      for (let x = 0; x < TEX_WIDTH; x++) {
        const i = (y * TEX_WIDTH + x) * 4;
        const stripe = ((x + y) % 16) < 8;
        if (stripe) {
          data[i] = 220; data[i + 1] = 200; data[i + 2] = 0; data[i + 3] = 255;
        } else {
          data[i] = 30; data[i + 1] = 30; data[i + 2] = 30; data[i + 3] = 255;
        }
      }
    }
    return data;
  }

  getPixel(textureId: number, x: number, y: number): [number, number, number] {
    const tex = this.textures.get(textureId);
    if (!tex) return [128, 128, 128];
    const idx = (y * TEX_WIDTH + x) * 4;
    return [tex[idx], tex[idx + 1], tex[idx + 2]];
  }
}
