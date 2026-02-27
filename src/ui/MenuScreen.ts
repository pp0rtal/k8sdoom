import { Player } from '../game/Player';
import { SCREEN_WIDTH, SCREEN_HEIGHT, MAX_GAME_DURATION } from '../constants';

export class MenuScreen {
  private wheelAngle = 0;

  update(dt: number): void {
    this.wheelAngle += dt * 0.5;
  }

  renderTitle(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Scanline background effect
    ctx.fillStyle = 'rgba(50, 108, 229, 0.03)';
    for (let y = 0; y < SCREEN_HEIGHT; y += 4) {
      ctx.fillRect(0, y, SCREEN_WIDTH, 2);
    }

    // Title
    ctx.fillStyle = '#326CE5';
    ctx.font = 'bold 52px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('K8S DOOM', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4);

    // Subtitle
    const lineSpacing = 25;
    ctx.fillStyle = '#aaa';
    ctx.font = '16px monospace';
    ctx.fillText('You are kube control plane (god itself)', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 + 15 +  + lineSpacing * 1);
    ctx.fillText('You need to Terminate the CronJobs to downscale', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 + 15 +  + lineSpacing * 2);
    ctx.fillText('Money flies away 💸 you have no more than ' + MAX_GAME_DURATION + ' to clear things up', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 + 15 +  + lineSpacing * 3);
    ctx.fillText('🔥 GOD MODE ACTIVATED 🔥 - NO MERCY', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 + 15 +  + lineSpacing * 4);

    // K8s wheel
    this.drawK8sWheel(ctx, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 30, 45);

    // Controls
    ctx.fillStyle = '#666';
    ctx.font = '13px monospace';
    ctx.fillText('WASD/ZQSD - Move laterally | ←↑→↓/Mouse - Turn  |  Click/Space - Shoot', SCREEN_WIDTH / 2, SCREEN_HEIGHT * 0.72);
    ctx.fillText('ESC - Release mouse  |  M - Toggle minimap', SCREEN_WIDTH / 2, SCREEN_HEIGHT * 0.76);

    // Start prompt
    ctx.fillStyle = '#326CE5';
    ctx.font = 'bold 18px monospace';
    const blink = Math.sin(Date.now() / 500) > 0;
    if (blink) {
      ctx.fillText('[ CLICK TO START ]', SCREEN_WIDTH / 2, SCREEN_HEIGHT * 0.87);
    }
  }

  renderWin(ctx: CanvasRenderingContext2D, player: Player, time: number): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Spinning green wheel
    this.drawK8sWheelColored(ctx, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 5, 40, '#00ff00');

    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 40px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CLUSTER NUKED', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 5 + 85);

    ctx.fillStyle = '#aaa';
    ctx.font = '15px monospace';
    ctx.fillText('Good game, you have nuked the cluster node', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 5 + 115);

    ctx.fillStyle = '#326CE5';
    ctx.font = '18px monospace';
    const statsY = SCREEN_HEIGHT / 2 + 10;
    const remainingSeconds = Math.round(Math.max(0, MAX_GAME_DURATION - time));
    const timeBonus = remainingSeconds * 100;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    ctx.fillText(`Pods Deleted: ${player.kills}`, SCREEN_WIDTH / 2, statsY);
    ctx.fillText(
      `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      SCREEN_WIDTH / 2, statsY + 32
    );
    ctx.fillStyle = '#ffaa00';
    ctx.fillText(`Time Bonus: +${remainingSeconds}s = +${timeBonus} pts`, SCREEN_WIDTH / 2, statsY + 64);
    ctx.fillStyle = '#326CE5';
    ctx.fillText(`Score: ${player.score}`, SCREEN_WIDTH / 2, statsY + 96);

    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 16px monospace';
    const blink = Math.sin(Date.now() / 500) > 0;
    if (blink) {
      ctx.fillText('[ CLICK TO PLAY AGAIN ]', SCREEN_WIDTH / 2, SCREEN_HEIGHT * 0.87);
    }
  }

  renderGameOver(ctx: CanvasRenderingContext2D, player: Player, time: number): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 44px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CLUSTER', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4);
    ctx.fillText('TERMINATED', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 + 50);

    ctx.fillStyle = '#888';
    ctx.font = '16px monospace';
    ctx.fillText('CronJobs overwhelmed the cluster', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 + 90);

    ctx.fillStyle = '#aaa';
    ctx.font = '18px monospace';
    const statsY = SCREEN_HEIGHT / 2 + 10;
    ctx.fillText(`Pods Deleted: ${player.kills}`, SCREEN_WIDTH / 2, statsY);
    ctx.fillText(`Score: ${player.score}`, SCREEN_WIDTH / 2, statsY + 30);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    ctx.fillText(
      `Time Survived: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      SCREEN_WIDTH / 2, statsY + 60
    );

    ctx.fillStyle = '#326CE5';
    ctx.font = 'bold 16px monospace';
    const blink = Math.sin(Date.now() / 500) > 0;
    if (blink) {
      ctx.fillText('[ CLICK TO RESTART ]', SCREEN_WIDTH / 2, SCREEN_HEIGHT * 0.85);
    }
  }

  private drawK8sWheelColored(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, color: string): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.wheelAngle);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const innerR = radius * 0.3;
      const outerR = radius * 0.85;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
      ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * outerR, Math.sin(angle) * outerR, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawK8sWheel(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.wheelAngle);

    ctx.strokeStyle = '#326CE5';
    ctx.lineWidth = 3;

    // Outer ring
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
    ctx.stroke();

    // 7 spokes with paddle shapes
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const innerR = radius * 0.3;
      const outerR = radius * 0.85;

      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
      ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
      ctx.stroke();

      // Paddle at end
      ctx.fillStyle = '#326CE5';
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * outerR, Math.sin(angle) * outerR, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
