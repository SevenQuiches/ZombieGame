import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../GameConfig';

export class StartScene extends Phaser.Scene {
  constructor() {
    super('StartScene');
  }

  create() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e);
    
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 3, '僵尸生存射击', {
      fontSize: '64px',
      color: '#ff4444',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);
    
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 3 + 80, 'ZOMBIE SURVIVAL SHOOTER', {
      fontSize: '24px',
      color: '#ff8888',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 
      'WASD - 移动\n鼠标 - 瞄准\n左键 - 射击\nR - 装弹', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    const startButton = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.7, '开始游戏', {
      fontSize: '36px',
      color: '#ffffff',
      fontFamily: 'Arial Black',
      backgroundColor: '#44aa44',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    startButton.on('pointerover', () => {
      startButton.setBackgroundColor('#66cc66');
    });

    startButton.on('pointerout', () => {
      startButton.setBackgroundColor('#44aa44');
    });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50, '坚持到第五波即可获胜！', {
      fontSize: '18px',
      color: '#aaaaaa'
    }).setOrigin(0.5);
  }
}
