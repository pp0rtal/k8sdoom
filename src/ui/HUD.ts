import { Player } from '../game/Player';
import { GameState } from '../game/GameState';
import { SCREEN_WIDTH, SCREEN_HEIGHT, MAX_AMMO, MAX_GAME_DURATION } from '../constants';

export class HUD {
  render(ctx: CanvasRenderingContext2D, player: Player, gameState: GameState): void {
    ctx.save();

    // Bottom bar
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, SCREEN_HEIGHT - 50, SCREEN_WIDTH, 50);

    ctx.font = 'bold 14px monospace';

    // Health
    const healthColor = player.health > 60 ? '#00ff00' : player.health > 30 ? '#ffaa00' : '#ff0000';
    ctx.fillStyle = healthColor;
    ctx.textAlign = 'left';
    ctx.fillText(`HEALTH: ${Math.round(Math.max(0, player.health))}`, 20, SCREEN_HEIGHT - 18);

    // Health bar
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, SCREEN_HEIGHT - 45, 100, 10);
    ctx.fillStyle = healthColor;
    ctx.fillRect(20, SCREEN_HEIGHT - 45, Math.max(0, player.health), 10);

    // Ammo
    ctx.fillStyle = player.ammo > 10 ? '#00ff00' : '#ff0000';
    ctx.textAlign = 'center';
    ctx.fillText(`AMMO: ${player.ammo}/${MAX_AMMO}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT - 18);

    // Ammo bar
    const ammoBarWidth = 100;
    const ammoBarX = SCREEN_WIDTH / 2 - ammoBarWidth / 2;
    ctx.strokeStyle = '#555';
    ctx.strokeRect(ammoBarX, SCREEN_HEIGHT - 45, ammoBarWidth, 10);
    ctx.fillStyle = player.ammo > 10 ? '#00ff00' : '#ff0000';
    ctx.fillRect(ammoBarX, SCREEN_HEIGHT - 45, (player.ammo / MAX_AMMO) * ammoBarWidth, 10);

    // Score and kills
    ctx.fillStyle = '#326CE5';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${player.score}`, SCREEN_WIDTH - 20, SCREEN_HEIGHT - 28);
    ctx.fillStyle = '#aaa';
    ctx.font = '12px monospace';
    ctx.fillText(`PODS DELETED: ${player.kills}`, SCREEN_WIDTH - 20, SCREEN_HEIGHT - 12);

    // Countdown timer
    const remaining = Math.max(0, MAX_GAME_DURATION - gameState.elapsedTime);
    const timerColor = remaining <= 10 ? '#ff0000' : '#888';
    ctx.fillStyle = timerColor;
    ctx.font = remaining <= 10 ? 'bold 14px monospace' : '12px monospace';
    ctx.textAlign = 'right';
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.ceil(remaining % 60);
    ctx.fillText(
      `TIME: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      SCREEN_WIDTH - 20, 20
    );

    ctx.restore();
  }
}
