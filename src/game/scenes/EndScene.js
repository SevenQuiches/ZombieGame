class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }
    
    init(data) {
        this.victory = data.victory || false;
        this.finalScore = data.score || 0;
        this.reachedWave = data.wave || 1;
    }
    
    create() {
        this.createBackground();
        
        if (this.victory) {
            this.createVictoryContent();
        } else {
            this.createDefeatContent();
        }
        
        this.createStats();
        this.createButtons();
        this.createParticles();
    }
    
    createBackground() {
        const bgColor = this.victory ? 0x1a3a1a : 0x2a1a1a;
        
        this.add.rectangle(
            GameConfig.GAME_WIDTH / 2,
            GameConfig.GAME_HEIGHT / 2,
            GameConfig.GAME_WIDTH,
            GameConfig.GAME_HEIGHT,
            bgColor
        );
    }
    
    createVictoryContent() {
        const title = this.add.text(
            GameConfig.GAME_WIDTH / 2,
            120,
            '胜利!',
            {
                fontSize: '72px',
                fontFamily: 'Arial Black',
                color: '#2ecc71',
                stroke: '#145a32',
                strokeThickness: 6
            }
        ).setOrigin(0.5);
        
        this.tweens.add({
            targets: title,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.add.text(
            GameConfig.GAME_WIDTH / 2,
            200,
            '你成功存活了5波僵尸攻击!',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#27ae60'
            }
        ).setOrigin(0.5);
    }
    
    createDefeatContent() {
        const title = this.add.text(
            GameConfig.GAME_WIDTH / 2,
            120,
            '失败',
            {
                fontSize: '72px',
                fontFamily: 'Arial Black',
                color: '#e74c3c',
                stroke: '#641e16',
                strokeThickness: 6
            }
        ).setOrigin(0.5);
        
        this.tweens.add({
            targets: title,
            alpha: 0.5,
            duration: 300,
            yoyo: true,
            repeat: -1
        });
        
        this.add.text(
            GameConfig.GAME_WIDTH / 2,
            200,
            '你被僵尸包围了...',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#e74c3c'
            }
        ).setOrigin(0.5);
    }
    
    createStats() {
        const statsContainer = this.add.container(GameConfig.GAME_WIDTH / 2, 350);
        
        const statsBg = this.add.rectangle(0, 0, 350, 120, 0x000000, 0.3);
        statsContainer.add(statsBg);
        
        const scoreText = this.add.text(0, -35, `最终分数: ${this.finalScore}`, {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#f1c40f'
        }).setOrigin(0.5);
        statsContainer.add(scoreText);
        
        const waveText = this.add.text(0, 5, `到达波次: ${this.reachedWave} / 5`, {
            fontSize: '22px',
            fontFamily: 'Arial',
            color: '#ecf0f1'
        }).setOrigin(0.5);
        statsContainer.add(waveText);
        
        const statusText = this.add.text(0, 40, 
            this.victory ? '生存大师' : '继续努力!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: this.victory ? '#2ecc71' : '#e67e22'
        }).setOrigin(0.5);
        statsContainer.add(statusText);
    }
    
    createButtons() {
        const retryButton = this.add.rectangle(
            GameConfig.GAME_WIDTH / 2 - 100,
            550,
            160,
            50,
            0x3498db
        );
        
        const retryText = this.add.text(
            GameConfig.GAME_WIDTH / 2 - 100,
            550,
            '重新开始',
            {
                fontSize: '22px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        retryButton.setInteractive({ useHandCursor: true });
        
        retryButton.on('pointerover', () => {
            retryButton.setFillStyle(0x5dade2);
        });
        
        retryButton.on('pointerout', () => {
            retryButton.setFillStyle(0x3498db);
        });
        
        retryButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
            });
        });
        
        const menuButton = this.add.rectangle(
            GameConfig.GAME_WIDTH / 2 + 100,
            550,
            160,
            50,
            0x9b59b6
        );
        
        const menuText = this.add.text(
            GameConfig.GAME_WIDTH / 2 + 100,
            550,
            '返回菜单',
            {
                fontSize: '22px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        menuButton.setInteractive({ useHandCursor: true });
        
        menuButton.on('pointerover', () => {
            menuButton.setFillStyle(0xa569bd);
        });
        
        menuButton.on('pointerout', () => {
            menuButton.setFillStyle(0x9b59b6);
        });
        
        menuButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('StartScene');
            });
        });
    }
    
    createParticles() {
        const particleColor = this.victory ? 0x2ecc71 : 0xe74c3c;
        
        for (let i = 0; i < 30; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, GameConfig.GAME_WIDTH),
                Phaser.Math.Between(0, GameConfig.GAME_HEIGHT),
                Phaser.Math.Between(3, 8),
                particleColor,
                0.4
            );
            
            this.tweens.add({
                targets: particle,
                y: particle.y - Phaser.Math.Between(50, 150),
                x: particle.x + Phaser.Math.Between(-50, 50),
                alpha: 0,
                duration: Phaser.Math.Between(2000, 4000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000),
                onRepeat: () => {
                    particle.x = Phaser.Math.Between(0, GameConfig.GAME_WIDTH);
                    particle.y = GameConfig.GAME_HEIGHT + 50;
                    particle.alpha = 0.4;
                }
            });
        }
    }
}
