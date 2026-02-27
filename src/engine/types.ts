export interface Vec2 {
  x: number;
  y: number;
}

export interface RayHit {
  distance: number;
  wallX: number;
  side: 0 | 1;
  mapX: number;
  mapY: number;
  tileType: number;
}

export interface GameMap {
  width: number;
  height: number;
  grid: number[][];
}

export interface InputState {
  forward: boolean;
  backward: boolean;
  strafeLeft: boolean;
  strafeRight: boolean;
  rotateLeft: boolean;
  rotateRight: boolean;
  shoot: boolean;
  mouseDeltaX: number;
}
