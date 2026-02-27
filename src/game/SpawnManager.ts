import { Enemy } from './Enemy';
import { EnemyAI } from './EnemyAI';
import { Player } from './Player';
import { World } from './World';
import { RESPAWN_INTERVAL, MAX_ENEMIES } from '../constants';

export class SpawnManager {
  private respawnTimers: { spawnPointIdx: number; timer: number }[] = [];
  private enemyAI: EnemyAI = new EnemyAI();
  private world: World;

  constructor(world: World) {
    this.world = world;
    for (const sp of world.spawnPoints) {
      const enemy = new Enemy(sp);
      world.entities.push(enemy);
    }
  }

  update(dt: number, player: Player): void {
    for (const enemy of this.world.entities) {
      this.enemyAI.update(enemy, player, this.world, dt);
    }

    for (let i = this.world.entities.length - 1; i >= 0; i--) {
      const e = this.world.entities[i];
      if (!e.alive && e.deathTimer <= 0) {
        this.world.entities.splice(i, 1);
        const spIdx = Math.floor(Math.random() * this.world.spawnPoints.length);
        this.respawnTimers.push({ spawnPointIdx: spIdx, timer: RESPAWN_INTERVAL / 1000 });
      }
    }

    for (let i = this.respawnTimers.length - 1; i >= 0; i--) {
      this.respawnTimers[i].timer -= dt;
      if (this.respawnTimers[i].timer <= 0) {
        if (this.world.entities.length < MAX_ENEMIES) {
          const sp = this.world.spawnPoints[this.respawnTimers[i].spawnPointIdx];
          this.world.entities.push(new Enemy(sp));
        }
        this.respawnTimers.splice(i, 1);
      }
    }
  }
}
