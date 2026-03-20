class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }
    
    preload() {
        console.log('StartScene preload');
    }
    
    create() {
        console.log('StartScene create');
        
        this.add.rectangle(
            GameConfig.GAME_WIDTH / 2,
            GameConfig.GAME_HEIGHT / 2,
            GameConfig.GAME_WIDTH,
            GameConfig.GAME_HEIGHT,
            0x1a1a2e
        );
        
        this.createTitle();
        this.createZombieDecorations();
        this.createInstructions();
        this.createStartButton();
        
        this.createParticles();
    }
    
    createTitle() {
        const title = this.add.text(
            GameConfig.GAME_WIDTH / 2,
            120,
            '僵尸生存射击',
            {
                fontSize: '64px',
                fontFamily: 'Arial Black',
                color: '#e74c3c',
                stroke: '#2c0707',
                strokeThickness: 6
            }
        ).setOrigin(0.5);
        
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        const subtitle = this.add.text(
            GameConfig.GAME_WIDTH / 2,
            180,
            'ZOMBIE SURVIVAL',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#7f8c8d',
                letterSpacing: 10
            }
        ).setOrigin(0.5);
    }
    
    createZombieDecorations() {
        const zombieColors = [0x4a7c4e, 0x7c4a4a, 0x4a4a7c];
        const zombieTypes = ['普通', '快速', '巨型'];
        
        for (let i = 0; i < 3; i++) {
            const zombie = this.add.graphics();
            zombie.fillStyle(zombieColors[i], 1);
            
            if (i === 0) {
                zombie.fillCircle(0, 0, 25);
            } else if (i === 1) {
                zombie.beginPath();
                zombie.moveTo(0, -20);
                zombie.lineTo(20, 20);
                zombie.lineTo(-20, 20);
                zombie.closePath();
                zombie.fillPath();
            } else {
                zombie.fillRect(-30, -30, 60, 60);
            }
            
            zombie.x = GameConfig.GAME_WIDTH / 2 - 150 + i * 150;
            zombie.y = 280;
            
            this.tweens.add({
                targets: zombie,
                y: zombie.y - 10,
                duration: 800 + i * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.add.text(zombie.x, zombie.y + 50, zombieTypes[i], {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#bdc3c7'
            }).setOrigin(0.5);
        }
    }
    
    createInstructions() {
        const instructions = [
            '🎮 WASD 或 方向键 移动',
            '🖱️ 鼠标瞄准，左键射击',
            '🔄 R键 装弹',
            '🎯 消灭所有僵尸，存活5波即可胜利！'
        ];
        
        const container = this.add.container(GameConfig.GAME_WIDTH / 2, 420);
        
        instructions.forEach((text, index) => {
            const instructionText = this.add.text(0, index * 35, text, {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#ecf0f1'
            }).setOrigin(0.5);
            container.add(instructionText);
        });
        
        this.tweens.add({
            targets: container,
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
    }
    
    createStartButton() {
        const buttonBg = this.add.rectangle(
            GameConfig.GAME_WIDTH / 2,
            600,
            250,
            60,
            0x27ae60
        );
        
        const buttonText = this.add.text(
            GameConfig.GAME_WIDTH / 2,
            600,
            '开始游戏',
            {
                fontSize: '28px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        
        buttonBg.setInteractive({ useHandCursor: true });
        
        buttonBg.on('pointerover', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
            buttonBg.setFillStyle(0x2ecc71);
        });
        
        buttonBg.on('pointerout', () => {
            this.tweens.add({
                targets: [buttonBg, buttonText],
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
            buttonBg.setFillStyle(0x27ae60);
        });
        
        buttonBg.on('pointerdown', () => {
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('GameScene');
            });
        });
        
        this.tweens.add({
            targets: buttonBg,
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, GameConfig.GAME_WIDTH),
                Phaser.Math.Between(0, GameConfig.GAME_HEIGHT),
                Phaser.Math.Between(2, 5),
                0xe74c3c,
                0.3
            );
            
            this.tweens.add({
                targets: particle,
                y: particle.y - 100,
                alpha: 0,
                duration: Phaser.Math.Between(2000, 4000),
                repeat: -1,
                onRepeat: () => {
                    particle.x = Phaser.Math.Between(0, GameConfig.GAME_WIDTH);
                    particle.y = GameConfig.GAME_HEIGHT + 50;
                    particle.alpha = 0.3;
                }
            });
        }
    }
}
