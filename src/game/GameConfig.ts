import Phaser from 'phaser';

export const GAME_WIDTH = 1200;
export const GAME_HEIGHT = 800;

export interface GameState {
  currentWave: number;
  score: number;
  isGameOver: boolean;
  isVictory: boolean;
}

export const ZOMBIE_TYPES = {
  NORMAL: {
    name: '普通僵尸',
    health: 100,
    speed: 1.2,
    damage: 10,
    color: 0x4a5c3a,
    size: 30,
    points: 10
  },
  FAST: {
    name: '快速僵尸',
    health: 60,
    speed: 2.5,
    damage: 8,
    color: 0x8b4513,
    size: 25,
    points: 20
  },
  GIANT: {
    name: '巨型僵尸',
    health: 300,
    speed: 0.6,
    damage: 30,
    color: 0x2d1f1f,
    size: 50,
    points: 50
  }
};

export const WAVE_CONFIG = [
  { zombies: 5, types: ['NORMAL'] },
  { zombies: 10, types: ['NORMAL', 'FAST'] },
  { zombies: 15, types: ['NORMAL', 'FAST'] },
  { zombies: 20, types: ['NORMAL', 'FAST', 'GIANT'] },
  { zombies: 25, types: ['NORMAL', 'FAST', 'GIANT'] }
];

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  pixelArt: true,
  roundPixels: true
};
