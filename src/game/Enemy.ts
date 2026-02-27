import type { Vec2 } from '../engine/types';
import { ENEMY_HEALTH } from '../constants';

const CRON_EXPRESSIONS = [
  'sendBufferEmailsEachOneMinute * * * * *',
  'sendBufferEmailsEachOneMinute * * * * *',
  'sendBufferEmailsEachOneMinute * * * * *',
  'sendBufferEmailsEachOneMinute * * * * *',
  'sendBufferEmailsEachOneMinute * * * * *',
  'sendBufferEmailsEachOneMinute * * * * *',
  'sendBufferEmailsEachOneMinute * * * * *',
  'sendBufferEmailsEachFiveMinutes */5 * * * *',
  'sendBufferEmailsEachFiveMinutes */5 * * * *',
  'programFinished * * * * *',
  'triggerUsersProgressWhenClassroomSlotEnds * * * * *',
  'sendClassroomSlotNotifications * * * * *',
];

export class Enemy {
  pos: Vec2;
  dir: Vec2;
  health: number;
  alive: boolean;
  cronExpression: string;
  state: 'patrol' | 'chase' | 'attack' | 'dead';
  patrolTarget: Vec2 | null;
  attackCooldown: number;
  deathTimer: number;

  constructor(spawnPos: Vec2) {
    this.pos = { x: spawnPos.x, y: spawnPos.y };
    this.dir = { x: 1, y: 0 };
    this.health = ENEMY_HEALTH;
    this.alive = true;
    this.cronExpression = CRON_EXPRESSIONS[Math.floor(Math.random() * CRON_EXPRESSIONS.length)];
    this.state = 'patrol';
    this.patrolTarget = null;
    this.attackCooldown = 0;
    this.deathTimer = 0;
  }

  takeDamage(amount: number): boolean {
    this.health -= amount;
    if (this.health <= 0) {
      this.alive = false;
      this.state = 'dead';
      this.deathTimer = 2.0;
      return true;
    }
    return false;
  }
}
