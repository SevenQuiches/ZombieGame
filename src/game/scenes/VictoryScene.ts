import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../GameConfig';

interface SceneData {
  score: number;
}

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create(data: SceneData) {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a2a1a);
    
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 4, '胜利！', {
      fontSize: '80px',
      color: '#44ff44',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 4 + 80, '你成功存活了所有波次！', {
      fontSize: '28px',
      color: '#88ff88',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, `最终分数: ${data.score}`, {
      fontSize: '36px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const restartButton = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.7, '再玩一次', {
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
