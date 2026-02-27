import { Player } from '../game/Player';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

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
    ctx.fillStyle = '#aaa';
    ctx.font = '16px monospace';
    ctx.fillText('Terminate the CronJobs pods to make space for production web workers', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 4 + 35);

    // K8s wheel
    this.drawK8sWheel(ctx, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 45);

    // Controls
    ctx.fillStyle = '#666';
    ctx.font = '13px monospace';
    ctx.fillText('WASD - Move  |  Mouse - Look  |  Click/Space - Shoot', SCREEN_WIDTH / 2, SCREEN_HEIGHT * 0.72);
    ctx.fillText('ESC - Release mouse  |  M - Toggle minimap', SCREEN_WIDTH / 2, SCREEN_HEIGHT * 0.76);

    // Start prompt
    ctx.fillStyle = '#326CE5';
    ctx.font = 'bold 18px monospace';
    const blink = Math.sin(Date.now() / 500) > 0;
    if (blink) {
      ctx.fillText('[ CLICK TO START ]', SCREEN_WIDTH / 2, SCREEN_HEIGHT * 0.87);
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
