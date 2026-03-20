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
        
        const gradient = this.add.graphics();
        gradient.fillStyle(this.victory ? 0x27ae60 : 0xe74c3c, 0.1);
        gradient.fillRect(0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT);
    }
    
    createVictoryContent() {
        const title = this.add.text(
            GameConfig.GAME_WIDTH / 2,
            120,
            '🎉 胜利! 🎉',
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
        
        this.createTrophy();
    }
    
    createDefeatContent() {
        const title = this.add.text(
            GameConfig.GAME_WIDTH / 2,
            120,
            '💀 失败 💀',
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
        
        this.createSkull();
    }
    
    createTrophy() {
        const trophy = this.add.graphics();
        trophy.fillStyle(0xf1c40f, 1);
        
        trophy.beginPath();
        trophy.moveTo(0, -40);
        trophy.lineTo(30, -20);
        trophy.lineTo(20, 20);
        trophy.lineTo(-20, 20);
        trophy.lineTo(-30, -20);
        trophy.closePath();
        trophy.fillPath();
        
        trophy.fillStyle(0xf39c12, 1);
        trophy.fillRect(-15, 20, 30, 15);
        trophy.fillRect(-25, 35, 50, 10);
        
        trophy.x = GameConfig.GAME_WIDTH / 2;
        trophy.y = 320;
        
        this.tweens.add({
            targets: trophy,
            y: trophy.y - 10,
            angle: 5,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createSkull() {
        const skull = this.add.graphics();
        skull.fillStyle(0xecf0f1, 1);
        
        skull.fillCircle(0, -10, 35);
        skull.fillRect(-25, 10, 50, 25);
        
        skull.fillStyle(0x2c3e50, 1);
        skull.fillCircle(-12, -15, 10);
        skull.fillCircle(12, -15, 10);
        skull.fillTriangle(0, 0, -8, 15, 8, 15);
        
        skull.x = GameConfig.GAME_WIDTH / 2;
        skull.y = 320;
        
        this.tweens.add({
            targets: skull,
            angle: { from: -5, to: 5 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createStats() {
        const statsContainer = this.add.container(GameConfig.GAME_WIDTH / 2, 430);
        
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
            this.victory ? '🏆 生存大师 🏆' : '继续努力!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: this.victory ? '#2ecc71' : '#e67e22'
        }).setOrigin(0.5);
        statsContainer.add(statusText);
    }
    
    createButtons() {
        const retryButton = this.add.rectangle(
            GameConfig.GAME_WIDTH / 2 - 100,
            580,
            160,
            50,
            0x3498db
        );
        
        const retryText = this.add.text(
            GameConfig.GAME_WIDTH / 2 - 100,
            580,
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
            this.tweens.add({
                targets: [retryButton, retryText],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
        });
        
        retryButton.on('pointerout', () => {
            retryButton.setFillStyle(0x3498db);
            this.tweens.add({
                targets: [retryButton, retryText],
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });
        
        retryButton.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
            });
        });
        
        const menuButton = this.add.rectangle(
            GameConfig.GAME_WIDTH / 2 + 100,
            580,
            160,
            50,
            0x9b59b6
        );
        
        const menuText = this.add.text(
            GameConfig.GAME_WIDTH / 2 + 100,
            580,
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
            this.tweens.add({
                targets: [menuButton, menuText],
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 100
            });
        });
        
        menuButton.on('pointerout', () => {
            menuButton.setFillStyle(0x9b59b6);
            this.tweens.add({
                targets: [menuButton, menuText],
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
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
