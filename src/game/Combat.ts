import type { Vec2 } from '../engine/types';
import { Enemy } from './Enemy';
import { Player } from './Player';
import { Weapon } from './Weapon';
import { World } from './World';
import { WEAPON_DAMAGE, WEAPON_RANGE, SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

export interface HitResult {
  hit: boolean;
  enemy: Enemy | null;
  killed: boolean;
}

export class Combat {
  private hitFeedbackTimer = 0;
  private killFeedbackTimer = 0;
  private lastKillLabel = '';
  private damageFlashTimer = 0;

  tryShoot(player: Player, weapon: Weapon, world: World): HitResult {
    if (player.ammo <= 0 || !weapon.fire()) {
      return { hit: false, enemy: null, killed: false };
    }

    player.ammo--;

    const cam = player.camera;
    let closestEnemy: Enemy | null = null;
    let closestDist = WEAPON_RANGE;

    for (const enemy of world.entities) {
      if (!enemy.alive) continue;

      const dx = enemy.pos.x - cam.pos.x;
      const dy = enemy.pos.y - cam.pos.y;

      const dot = dx * cam.dir.x + dy * cam.dir.y;
      if (dot <= 0 || dot > WEAPON_RANGE) continue;

      const perpDist = Math.abs(dx * cam.dir.y - dy * cam.dir.x);
      const hitRadius = 0.4;

      if (perpDist < hitRadius && dot < closestDist) {
        if (this.hasLineOfSight(cam.pos, enemy.pos, world)) {
          closestDist = dot;
          closestEnemy = enemy;
        }
      }
    }

    if (closestEnemy) {
      const killed = closestEnemy.takeDamage(WEAPON_DAMAGE);
      this.hitFeedbackTimer = 0.15;
      if (killed) {
        player.score += 100;
        player.kills++;
        this.killFeedbackTimer = 1.5;
        this.lastKillLabel = `kubectl delete pod ${closestEnemy.cronExpression}`;
      }
      return { hit: true, enemy: closestEnemy, killed };
    }

    return { hit: false, enemy: null, killed: false };
  }

  onPlayerDamaged(): void {
    this.damageFlashTimer = 0.3;
  }

  update(dt: number): void {
    if (this.hitFeedbackTimer > 0) this.hitFeedbackTimer -= dt;
    if (this.killFeedbackTimer > 0) this.killFeedbackTimer -= dt;
    if (this.damageFlashTimer > 0) this.damageFlashTimer -= dt;
  }

  renderFeedback(ctx: CanvasRenderingContext2D): void {
    const cx = SCREEN_WIDTH / 2;
    const cy = SCREEN_HEIGHT / 2;

    // Crosshair
    ctx.strokeStyle = this.hitFeedbackTimer > 0 ? '#ff0000' : '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy); ctx.lineTo(cx - 4, cy);
    ctx.moveTo(cx + 4, cy); ctx.lineTo(cx + 12, cy);
    ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy - 4);
    ctx.moveTo(cx, cy + 4); ctx.lineTo(cx, cy + 12);
    ctx.stroke();

    // Dot
    ctx.fillStyle = this.hitFeedbackTimer > 0 ? '#ff0000' : '#00ff00';
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();

    // Hit marker flash
    if (this.hitFeedbackTimer > 0) {
      ctx.fillStyle = `rgba(255, 50, 0, ${this.hitFeedbackTimer / 0.15 * 0.15})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    // Kill notification
    if (this.killFeedbackTimer > 0) {
      const alpha = Math.min(1, this.killFeedbackTimer);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("💀 " + this.lastKillLabel + " 💀", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 50);
    }

    // Damage vignette
    if (this.damageFlashTimer > 0) {
      const alpha = this.damageFlashTimer / 0.3 * 0.4;
      ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
      ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
  }

  private hasLineOfSight(from: Vec2, to: Vec2, world: World): boolean {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(dist * 4);
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      if (world.isWall(from.x + dx * t, from.y + dy * t)) return false;
    }
    return true;
  }
}
