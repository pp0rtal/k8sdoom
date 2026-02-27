export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover';

export class GameState {
  phase: GamePhase = 'menu';
  elapsedTime = 0;

  transitionTo(newPhase: GamePhase): void {
    this.phase = newPhase;
    if (newPhase === 'playing') {
      this.elapsedTime = 0;
    }
  }

  update(dt: number): void {
    if (this.phase === 'playing') {
      this.elapsedTime += dt;
    }
  }
}
