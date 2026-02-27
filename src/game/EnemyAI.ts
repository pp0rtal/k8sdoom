import type { Vec2 } from '../engine/types';
import { Enemy } from './Enemy';
import { Player } from './Player';
import { World } from './World';
import { ENEMY_SPEED, ENEMY_ATTACK_RANGE, ENEMY_SIGHT_RANGE, ENEMY_DAMAGE } from '../constants';

export class EnemyAI {
  update(enemy: Enemy, player: Player, world: World, dt: number): void {
    if (!enemy.alive) {
      enemy.deathTimer -= dt;
      return;
    }

    const distToPlayer = this.distance(enemy.pos, player.camera.pos);
    const canSeePlayer = this.lineOfSight(enemy.pos, player.camera.pos, world);

    switch (enemy.state) {
      case 'patrol':
        this.patrol(enemy, world, dt);
        if (canSeePlayer && distToPlayer < ENEMY_SIGHT_RANGE) {
          enemy.state = 'chase';
        }
        break;
      case 'chase':
        this.chase(enemy, player, world, dt);
        if (distToPlayer < ENEMY_ATTACK_RANGE) {
          enemy.state = 'attack';
        } else if (!canSeePlayer || distToPlayer > ENEMY_SIGHT_RANGE * 1.5) {
          enemy.state = 'patrol';
        }
        break;
      case 'attack':
        this.attack(enemy, player, dt);
        if (distToPlayer > ENEMY_ATTACK_RANGE * 1.5) {
          enemy.state = 'chase';
        }
        break;
    }
  }

  private patrol(enemy: Enemy, world: World, dt: number): void {
    if (!enemy.patrolTarget || this.distance(enemy.pos, enemy.patrolTarget) < 0.5) {
      enemy.patrolTarget = this.randomOpenNeighbor(enemy.pos, world);
    }
    if (enemy.patrolTarget) {
      this.moveToward(enemy, enemy.patrolTarget, ENEMY_SPEED * 0.5, world, dt);
    }
  }

  private chase(enemy: Enemy, player: Player, world: World, dt: number): void {
    this.moveToward(enemy, player.camera.pos, ENEMY_SPEED, world, dt);
  }

  private attack(enemy: Enemy, player: Player, dt: number): void {
    enemy.attackCooldown -= dt;
    if (enemy.attackCooldown <= 0) {
      player.health -= ENEMY_DAMAGE;
      enemy.attackCooldown = 1.5;
    }
  }

  private lineOfSight(from: Vec2, to: Vec2, world: World): boolean {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(dist * 4);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = from.x + dx * t;
      const y = from.y + dy * t;
      if (world.isWall(x, y)) return false;
    }
    return true;
  }

  private moveToward(enemy: Enemy, target: Vec2, speed: number, world: World, dt: number): void {
    const dx = target.x - enemy.pos.x;
    const dy = target.y - enemy.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.01) return;

    const moveX = (dx / dist) * speed * dt;
    const moveY = (dy / dist) * speed * dt;

    const r = 0.2;
    const newX = enemy.pos.x + moveX;
    const newY = enemy.pos.y + moveY;

    if (!world.isWall(newX + r * Math.sign(moveX), enemy.pos.y + r) &&
        !world.isWall(newX + r * Math.sign(moveX), enemy.pos.y - r)) {
      enemy.pos.x = newX;
    }
    if (!world.isWall(enemy.pos.x + r, newY + r * Math.sign(moveY)) &&
        !world.isWall(enemy.pos.x - r, newY + r * Math.sign(moveY))) {
      enemy.pos.y = newY;
    }

    enemy.dir = { x: dx / dist, y: dy / dist };
  }

  private distance(a: Vec2, b: Vec2): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  private randomOpenNeighbor(pos: Vec2, world: World): Vec2 | null {
    for (let attempt = 0; attempt < 10; attempt++) {
      const x = Math.floor(pos.x) + Math.floor(Math.random() * 7) - 3;
      const y = Math.floor(pos.y) + Math.floor(Math.random() * 7) - 3;
      if (!world.isWall(x + 0.5, y + 0.5)) {
        return { x: x + 0.5, y: y + 0.5 };
      }
    }
    return null;
  }
}
