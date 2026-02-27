import { GameLoop } from './engine/GameLoop';
import { Raycaster } from './engine/Raycaster';
import { Renderer } from './engine/Renderer';
import { SpriteRenderer } from './engine/SpriteRenderer';
import { TextureManager } from './engine/TextureManager';
import { InputManager } from './engine/InputManager';
import { Minimap } from './engine/Minimap';
import { Player } from './game/Player';
import { World } from './game/World';
import { SpawnManager } from './game/SpawnManager';
import { Combat } from './game/Combat';
import { Weapon } from './game/Weapon';
import { GameState } from './game/GameState';
import { HUD } from './ui/HUD';
import { MenuScreen } from './ui/MenuScreen';
import { PostProcessing } from './ui/PostProcessing';
import { SoundManager } from './audio/SoundManager';
import { SCREEN_WIDTH, SCREEN_HEIGHT, FIXED_DT, HEALTH_DRAIN_RATE, MAX_GAME_DURATION } from './constants';

const canvas = document.getElementById('game') as HTMLCanvasElement;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
const ctx = canvas.getContext('2d')!;

// Engine systems
const textures = new TextureManager();
const raycaster = new Raycaster();
const renderer = new Renderer(ctx, textures);
const spriteRenderer = new SpriteRenderer();
const input = new InputManager(canvas);
const minimap = new Minimap();

// UI systems
const hud = new HUD();
const menu = new MenuScreen();
const postFx = new PostProcessing(ctx);
const sound = new SoundManager();
const gameState = new GameState();

// Game objects (created on game start)
let world: World;
let player: Player;
let spawnManager: SpawnManager;
let combat: Combat;
let weapon: Weapon;
let showMinimap = true;

function startGame(): void {
  world = new World();
  const spawn = world.findPlayerStart();
  player = new Player(spawn);
  spawnManager = new SpawnManager(world);
  combat = new Combat();
  weapon = new Weapon();
  sound.init();
  gameState.transitionTo('playing');
}

canvas.addEventListener('click', () => {
  if (gameState.phase === 'menu' || gameState.phase === 'gameover' || gameState.phase === 'won') {
    startGame();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyM') {
    showMinimap = !showMinimap;
  }
});

function update(dt: number): void {
  if (gameState.phase === 'menu') {
    menu.update(dt);
    return;
  }
  if (gameState.phase !== 'playing') return;

  const inputState = input.getState();
  player.update(dt, inputState, world);
  spawnManager.update(dt, player);
  combat.update(dt);

  const isMoving = inputState.forward || inputState.backward ||
                   inputState.strafeLeft || inputState.strafeRight;
  weapon.update(dt, isMoving);

  if (inputState.shoot) {
    const result = combat.tryShoot(player, weapon, world);
    if (result.hit) {
      sound.playHit();
      if (result.killed) {
        sound.playEnemyDeath();
      }
    } else if (player.ammo > 0) {
      sound.playShoot();
    }
  }

  // Drain health over MAX_GAME_DURATION seconds (god mode — enemies deal no damage, time is the threat)
  player.health -= dt * HEALTH_DRAIN_RATE;

  gameState.update(dt);

  // Win: all pods nuked (and at least one was killed so we don't trigger on first frame)
  if (player.kills > 0 && world.entities.every(e => !e.alive)) {
    // Time bonus: +100 points per remaining second (rounded)
    const remainingSeconds = Math.round(Math.max(0, MAX_GAME_DURATION - gameState.elapsedTime));
    player.score += remainingSeconds * 100;
    gameState.transitionTo('won');
  }

  // Lose: time ran out
  if (player.health <= 0) {
    gameState.transitionTo('gameover');
  }
}

function render(_interpolation: number): void {
  switch (gameState.phase) {
    case 'menu':
      menu.renderTitle(ctx);
      break;

    case 'playing': {
      const hits = raycaster.castAllRays(player.camera, world.map);
      renderer.renderFrame(hits);
      spriteRenderer.renderSprites(ctx, player.camera, world.entities, renderer.zBuffer);
      weapon.render(ctx);
      combat.renderFeedback(ctx);
      hud.render(ctx, player, gameState);
      if (showMinimap) {
        minimap.render(ctx, world.map, player.camera, world.entities);
      }
      postFx.apply(ctx);
      break;
    }

    case 'gameover':
      menu.renderGameOver(ctx, player, gameState.elapsedTime);
      break;

    case 'won':
      menu.renderWin(ctx, player, gameState.elapsedTime);
      break;
  }
}

const loop = new GameLoop(FIXED_DT, update, render);
loop.start();
