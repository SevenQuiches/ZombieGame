import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../GameConfig';

interface SceneData {
  score: number;
  wave: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data: SceneData) {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e);
    
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 4, '游戏结束', {
      fontSize: '72px',
      color: '#ff4444',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, `最终分数: ${data.score}`, {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, `坚持到第 ${data.wave} 波`, {
      fontSize: '28px',
      color: '#aaaaaa',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const restartButton = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.7, '重新开始', {
      fontSize: '36px',
      color: '#ffffff',
      fontFamily: 'Arial Black',
      backgroundColor: '#44aa44',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restartButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    restartButton.on('pointerover', () => {
      restartButton.setBackgroundColor('#66cc66');
    });

    restartButton.on('pointerout', () => {
      restartButton.setBackgroundColor('#44aa44');
    });

    const menuButton = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.8, '返回主菜单', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#666666',
      padding: { x: 25, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuButton.on('pointerdown', () => {
      this.scene.start('StartScene');
    });

    menuButton.on('pointerover', () => {
      menuButton.setBackgroundColor('#888888');
    });

    menuButton.on('pointerout', () => {
      menuButton.setBackgroundColor('#666666');
    });
  }
}
