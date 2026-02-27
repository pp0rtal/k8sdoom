import type { GameMap, Vec2 } from '../engine/types';
import { MapGenerator } from './MapGenerator';
import { Enemy } from './Enemy';

const SIDE_SIZE = 10;

export class World {
  readonly map: GameMap;
  readonly entities: Enemy[];
  readonly spawnPoints: Vec2[];

  constructor() {
    const grid = MapGenerator.generate(SIDE_SIZE, SIDE_SIZE);
    this.map = { width: SIDE_SIZE, height: SIDE_SIZE, grid };
    this.spawnPoints = this.findOpenCells(30);
    this.entities = [];
  }

  isWall(x: number, y: number): boolean {
    const mx = Math.floor(x);
    const my = Math.floor(y);
    if(isNaN(mx) || isNaN(my)) return true;
    if (mx < 0 || mx >= this.map.width || my < 0 || my >= this.map.height) return true;
    return this.map.grid[my][mx] > 0;
  }

  findOpenCells(count: number): Vec2[] {
    const open: Vec2[] = [];
    for (let y = 1; y < this.map.height - 1; y++) {
      for (let x = 1; x < this.map.width - 1; x++) {
        if (this.map.grid[y][x] === 0) {
          open.push({ x: x + 0.5, y: y + 0.5 });
        }
      }
    }
    // Shuffle and take count
    for (let i = open.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [open[i], open[j]] = [open[j], open[i]];
    }
    return open.slice(0, count);
  }

  findPlayerStart(): Vec2 {
    // Find an open cell far from spawn points
    for (let y = 1; y < this.map.height - 1; y++) {
      for (let x = 1; x < this.map.width - 1; x++) {
        if (this.map.grid[y][x] === 0) {
          const pos = { x: x + 0.5, y: y + 0.5 };
          const minDist = this.spawnPoints.reduce((min, sp) => {
            const d = Math.sqrt((sp.x - pos.x) ** 2 + (sp.y - pos.y) ** 2);
            return Math.min(min, d);
          }, Infinity);
          if (minDist > 4) return pos;
        }
      }
    }
    // Fallback: first open cell
    return this.findOpenCells(1)[0];
  }
}
