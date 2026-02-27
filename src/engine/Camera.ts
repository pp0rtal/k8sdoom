import type { Vec2 } from './types';
import { FOV } from '../constants';

export class Camera {
  pos: Vec2;
  dir: Vec2;
  plane: Vec2;

  constructor(x: number, y: number, angle: number) {
    this.pos = { x, y };
    this.dir = { x: Math.cos(angle), y: Math.sin(angle) };
    const planeLen = Math.tan(FOV / 2);
    this.plane = { x: -this.dir.y * planeLen, y: this.dir.x * planeLen };
  }

  rotate(angle: number): void {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const oldDirX = this.dir.x;
    this.dir.x = this.dir.x * cos - this.dir.y * sin;
    this.dir.y = oldDirX * sin + this.dir.y * cos;
    const oldPlaneX = this.plane.x;
    this.plane.x = this.plane.x * cos - this.plane.y * sin;
    this.plane.y = oldPlaneX * sin + this.plane.y * cos;
  }
}
