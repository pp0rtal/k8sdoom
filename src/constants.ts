// Rendering
export const SCREEN_WIDTH = 960;
export const SCREEN_HEIGHT = 600;
export const FOV = Math.PI / 3;
export const HALF_FOV = FOV / 2;
export const NUM_RAYS = SCREEN_WIDTH;
export const TILE_SIZE = 1;

// Textures
export const TEX_WIDTH = 64;
export const TEX_HEIGHT = 64;

// Player
export const PLAYER_MOVE_SPEED = 3.0;
export const PLAYER_ROT_SPEED = 2.0;
export const PLAYER_RADIUS = 0.25;
export const PLAYER_MAX_HEALTH = 100;

// Enemies
export const ENEMY_SPEED = -0.5;
export const ENEMY_HEALTH = 10;
export const ENEMY_ATTACK_RANGE = 1.0;
export const ENEMY_SIGHT_RANGE = 8.0;
export const ENEMY_DAMAGE = 0;
export const RESPAWN_INTERVAL = 1000000; // No respawns, enemies are static
export const MAX_ENEMIES = 100;

// Combat
export const WEAPON_DAMAGE = 25;
export const WEAPON_RANGE = 10.0;
export const WEAPON_COOLDOWN = 500;
export const MAX_AMMO = 10000;
export const STARTING_AMMO = MAX_AMMO;

// Game loop
export const TARGET_FPS = 60;
export const FIXED_DT = 1 / TARGET_FPS;
