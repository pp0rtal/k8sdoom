import type { InputState } from './types';

export class InputManager {
  private keys: Set<string> = new Set();
  private _mouseDeltaX = 0;
  private pointerLocked = false;
  private shootTriggered = false;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    document.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      e.preventDefault();
    });
    document.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });
    document.addEventListener('mousemove', (e) => {
      if (this.pointerLocked) {
        this._mouseDeltaX += e.movementX;
      }
    });
    document.addEventListener('mousedown', (e) => {
      if (e.button === 0 && this.pointerLocked) {
        this.shootTriggered = true;
      }
    });
    canvas.addEventListener('click', () => {
      if (!this.pointerLocked) {
        canvas.requestPointerLock();
      }
    });
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === this.canvas;
    });
  }

  get isPointerLocked(): boolean {
    return this.pointerLocked;
  }

  getState(): InputState {
    const shoot = this.shootTriggered || this.keys.has('Space');
    this.shootTriggered = false;

    const state: InputState = {
      forward: this.keys.has('KeyW') || this.keys.has('ArrowUp'),
      backward: this.keys.has('KeyS') || this.keys.has('ArrowDown'),
      strafeLeft: this.keys.has('KeyA'),
      strafeRight: this.keys.has('KeyD'),
      rotateLeft: this.keys.has('ArrowLeft'),
      rotateRight: this.keys.has('ArrowRight'),
      shoot,
      mouseDeltaX: this._mouseDeltaX,
    };
    this._mouseDeltaX = 0;
    return state;
  }
}
