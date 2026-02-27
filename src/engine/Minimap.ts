import { Camera } from './Camera';
import type { GameMap } from './types';
import { Enemy } from '../game/Enemy';

export class Minimap {
  private static readonly SCALE = 6;
  private static readonly OPACITY = 0.7;

  render(ctx: CanvasRenderingContext2D, map: GameMap, camera: Camera, enemies: Enemy[]): void {
    const s = Minimap.SCALE;
    const offsetX = 10;
    const offsetY = 10;

    ctx.save();
    ctx.globalAlpha = Minimap.OPACITY;

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        ctx.fillStyle = map.grid[y][x] > 0 ? '#555' : '#111';
        ctx.fillRect(offsetX + x * s, offsetY + y * s, s, s);
      }
    }

    ctx.fillStyle = '#326CE5';
    ctx.beginPath();
    ctx.arc(offsetX + camera.pos.x * s, offsetY + camera.pos.y * s, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#326CE5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(offsetX + camera.pos.x * s, offsetY + camera.pos.y * s);
    ctx.lineTo(
      offsetX + (camera.pos.x + camera.dir.x * 2) * s,
      offsetY + (camera.pos.y + camera.dir.y * 2) * s
    );
    ctx.stroke();

    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      ctx.fillStyle = '#f00';
      ctx.beginPath();
      ctx.arc(offsetX + enemy.pos.x * s, offsetY + enemy.pos.y * s, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
