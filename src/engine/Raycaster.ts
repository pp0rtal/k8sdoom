import { Camera } from './Camera';
import type { GameMap, RayHit } from './types';
import { NUM_RAYS } from '../constants';

export class Raycaster {
  castAllRays(camera: Camera, map: GameMap): RayHit[] {
    const hits: RayHit[] = new Array(NUM_RAYS);
    for (let x = 0; x < NUM_RAYS; x++) {
      hits[x] = this.castRay(camera, map, x);
    }
    return hits;
  }

  private castRay(camera: Camera, map: GameMap, screenX: number): RayHit {
    const cameraX = 2 * screenX / NUM_RAYS - 1;
    const rayDirX = camera.dir.x + camera.plane.x * cameraX;
    const rayDirY = camera.dir.y + camera.plane.y * cameraX;

    let mapX = Math.floor(camera.pos.x);
    let mapY = Math.floor(camera.pos.y);

    const deltaDistX = Math.abs(1 / rayDirX);
    const deltaDistY = Math.abs(1 / rayDirY);

    let stepX: number, stepY: number;
    let sideDistX: number, sideDistY: number;

    if (rayDirX < 0) {
      stepX = -1;
      sideDistX = (camera.pos.x - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1.0 - camera.pos.x) * deltaDistX;
    }
    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (camera.pos.y - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1.0 - camera.pos.y) * deltaDistY;
    }

    let side: 0 | 1 = 0;
    let maxSteps = 64;
    while (maxSteps-- > 0) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }
      if (mapY >= 0 && mapY < map.height && mapX >= 0 && mapX < map.width && map.grid[mapY][mapX] > 0) {
        break;
      }
    }

    const perpWallDist = side === 0
      ? sideDistX - deltaDistX
      : sideDistY - deltaDistY;

    let wallX = side === 0
      ? camera.pos.y + perpWallDist * rayDirY
      : camera.pos.x + perpWallDist * rayDirX;
    wallX -= Math.floor(wallX);

    return {
      distance: Math.max(perpWallDist, 0.001),
      wallX,
      side,
      mapX,
      mapY,
      tileType: (mapY >= 0 && mapY < map.height && mapX >= 0 && mapX < map.width)
        ? map.grid[mapY][mapX]
        : 1,
    };
  }
}
