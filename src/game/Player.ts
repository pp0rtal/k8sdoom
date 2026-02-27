import { Camera } from '../engine/Camera';
import type { InputState, Vec2 } from '../engine/types';
import { World } from './World';
import {
  PLAYER_MOVE_SPEED, PLAYER_ROT_SPEED, PLAYER_RADIUS,
  PLAYER_MAX_HEALTH, STARTING_AMMO
} from '../constants';

export class Player {
  camera: Camera;
  health: number;
  ammo: number;
  score: number;
  kills: number;

  constructor(spawnPos: Vec2) {
    this.camera = new Camera(spawnPos.x, spawnPos.y, 0);
    this.health = PLAYER_MAX_HEALTH;
    this.ammo = STARTING_AMMO;
    this.score = 0;
    this.kills = 0;
  }

  update(dt: number, input: InputState, world: World): void {
    if (input.rotateLeft) this.camera.rotate(-PLAYER_ROT_SPEED * dt);
    if (input.rotateRight) this.camera.rotate(PLAYER_ROT_SPEED * dt);

    if (input.mouseDeltaX !== 0) {
      this.camera.rotate(input.mouseDeltaX * 0.003);
    }

    let moveX = 0, moveY = 0;
    if (input.forward) {
      moveX += this.camera.dir.x * PLAYER_MOVE_SPEED * dt;
      moveY += this.camera.dir.y * PLAYER_MOVE_SPEED * dt;
    }
    if (input.backward) {
      moveX -= this.camera.dir.x * PLAYER_MOVE_SPEED * dt;
      moveY -= this.camera.dir.y * PLAYER_MOVE_SPEED * dt;
    }
    if (input.strafeLeft) {
      moveX -= this.camera.plane.x * PLAYER_MOVE_SPEED * dt;
      moveY -= this.camera.plane.y * PLAYER_MOVE_SPEED * dt;
    }
    if (input.strafeRight) {
      moveX += this.camera.plane.x * PLAYER_MOVE_SPEED * dt;
      moveY += this.camera.plane.y * PLAYER_MOVE_SPEED * dt;
    }

    this.applyMovement(moveX, moveY, world);
  }

  get isMoving(): boolean {
    return false; // overridden by input check in main loop
  }

  private applyMovement(moveX: number, moveY: number, world: World): void {
    if (moveX === 0 && moveY === 0) return;
    const r = PLAYER_RADIUS;

    const newX = this.camera.pos.x + moveX;
    if (!world.isWall(newX + r, this.camera.pos.y + r) &&
        !world.isWall(newX + r, this.camera.pos.y - r) &&
        !world.isWall(newX - r, this.camera.pos.y + r) &&
        !world.isWall(newX - r, this.camera.pos.y - r)) {
      this.camera.pos.x = newX;
    }

    const newY = this.camera.pos.y + moveY;
    if (!world.isWall(this.camera.pos.x + r, newY + r) &&
        !world.isWall(this.camera.pos.x + r, newY - r) &&
        !world.isWall(this.camera.pos.x - r, newY + r) &&
        !world.isWall(this.camera.pos.x - r, newY - r)) {
      this.camera.pos.y = newY;
    }
  }
}
