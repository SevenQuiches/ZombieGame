class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        this.score = 0;
        this.currentWave = 1;
        this.zombies = [];
        this.zombiesKilledInWave = 0;
        this.zombiesToSpawnInWave = 0;
        this.zombiesSpawned = 0;
        this.isWaveActive = false;
        this.isPreparing = false;
        this.gameOver = false;
        this.isVictory = false;
        
        this.createBackground();
        this.createPlayer();
        this.createUI();
        this.setupEvents();
        
        this.startWavePreparation();
    }
    
    createBackground() {
        this.add.rectangle(
            GameConfig.GAME_WIDTH / 2,
            GameConfig.GAME_HEIGHT / 2,
            GameConfig.GAME_WIDTH,
            GameConfig.GAME_HEIGHT,
            GameConfig.COLORS.BACKGROUND
        );
        
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, GameConfig.GAME_WIDTH);
            const y = Phaser.Math.Between(0, GameConfig.GAME_HEIGHT);
            const size = Phaser.Math.Between(2, 6);
            const alpha = Phaser.Math.FloatBetween(0.1, 0.3);
            
            this.add.circle(x, y, size, 0x636e72, alpha);
        }
        
        for (let i = 0; i < 10; i++) {
            const x = Phaser.Math.Between(50, GameConfig.GAME_WIDTH - 50);
            const y = Phaser.Math.Between(50, GameConfig.GAME_HEIGHT - 50);
            
            const obstacle = this.add.rectangle(x, y, 40, 40, 0x636e72, 0.5);
            obstacle.setStrokeStyle(2, 0x2d3436);
        }
    }
    
    createPlayer() {
        this.player = new Player(
            this,
            GameConfig.GAME_WIDTH / 2,
            GameConfig.GAME_HEIGHT / 2
        );
    }
    
    createUI() {
        this.uiContainer = this.add.container(0, 0);
        this.uiContainer.setDepth(100);
        
        this.waveText = this.add.text(
            GameConfig.GAME_WIDTH / 2,
            30,
            '波次: 1 / 5',
            {
                fontSize: '28px',
                fontFamily: 'Arial Black',
                color: '#9b59b6',
                stroke: '#2c0450',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        this.uiContainer.add(this.waveText);
        
        this.healthLabel = this.add.text(20, 20, '生命值:', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });
        this.uiContainer.add(this.healthLabel);
        
        this.healthBarBg = this.add.rectangle(120, 28, 200, 20, 0x333333);
        this.uiContainer.add(this.healthBarBg);
        
        this.healthBarFill = this.add.rectangle(20, 28, 200, 20, 0x2ecc71);
        this.healthBarFill.setOrigin(0, 0.5);
        this.healthBarFill.x = 20;
        this.uiContainer.add(this.healthBarFill);
        
        this.healthText = this.add.text(220, 20, '100', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });
        this.uiContainer.add(this.healthText);
        
        this.ammoLabel = this.add.text(20, 50, '弹药:', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });
        this.uiContainer.add(this.ammoLabel);
        
        this.ammoText = this.add.text(90, 50, '30 / 30', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#f39c12'
        });
        this.uiContainer.add(this.ammoText);
        
        this.reloadText = this.add.text(90, 75, '', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#e74c3c'
        });
        this.uiContainer.add(this.reloadText);
        
        this.scoreText = this.add.text(
            GameConfig.GAME_WIDTH - 20,
            20,
            '分数: 0',
            {
                fontSize: '24px',
                fontFamily: 'Arial Black',
                color: '#f1c40f',
                stroke: '#7d6000',
                strokeThickness: 2
            }
        ).setOrigin(1, 0);
        this.uiContainer.add(this.scoreText);
        
        this.zombiesRemainingText = this.add.text(
            GameConfig.GAME_WIDTH - 20,
            55,
            '剩余僵尸: 0',
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#e74c3c'
            }
        ).setOrigin(1, 0);
        this.uiContainer.add(this.zombiesRemainingText);
        
        this.waveAnnouncement = this.add.text(
            GameConfig.GAME_WIDTH / 2,
            GameConfig.GAME_HEIGHT / 2,
            '',
            {
                fontSize: '48px',
                fontFamily: 'Arial Black',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5).setAlpha(0);
        this.uiContainer.add(this.waveAnnouncement);
    }
    
    setupEvents() {
        this.events.on('zombie-killed', (score) => {
            this.score += score;
            this.zombiesKilledInWave++;
            this.updateScoreUI();
            this.updateZombiesRemainingUI();
        });
        
        this.events.on('player-death', () => {
            this.endGame(false);
        });
        
        this.events.on('reload-start', () => {
            this.reloadText.setText('装弹中...');
        });
        
        this.events.on('reload-complete', () => {
            this.reloadText.setText('');
        });
    }
    
    startWavePreparation() {
        this.isPreparing = true;
        this.isWaveActive = false;
        
        const waveNum = this.currentWave;
        this.waveAnnouncement.setText(`波次 ${waveNum} 准备!`);
        this.waveAnnouncement.setAlpha(1);
        
        this.tweens.add({
            targets: this.waveAnnouncement,
            alpha: 0,
            duration: 500,
            delay: 2000
        });
        
        this.time.delayedCall(GameConfig.WAVE.PREPARATION_TIME, () => {
            this.startWave();
        });
    }
    
    startWave() {
        this.isPreparing = false;
        this.isWaveActive = true;
        this.zombiesKilledInWave = 0;
        this.zombiesSpawned = 0;
        
        this.zombiesToSpawnInWave = GameConfig.WAVE.BASE_ZOMBIE_COUNT + 
            (this.currentWave - 1) * GameConfig.WAVE.ZOMBIE_INCREMENT;
        
        this.waveAnnouncement.setText(`第 ${this.currentWave} 波开始!`);
        this.waveAnnouncement.setAlpha(1);
        
        this.tweens.add({
            targets: this.waveAnnouncement,
            alpha: 0,
            duration: 500,
            delay: 1500
        });
        
        this.spawnZombies();
    }
    
    spawnZombies() {
        if (this.zombiesSpawned >= this.zombiesToSpawnInWave || this.gameOver) {
            return;
        }
        
        this.spawnSingleZombie();
        this.zombiesSpawned++;
        
        this.time.delayedCall(GameConfig.WAVE.SPAWN_INTERVAL, () => {
            this.spawnZombies();
        });
    }
    
    spawnSingleZombie() {
        const side = Phaser.Math.Between(0, 3);
        let x, y;
        
        switch (side) {
            case 0:
                x = Phaser.Math.Between(0, GameConfig.GAME_WIDTH);
                y = -30;
                break;
            case 1:
                x = GameConfig.GAME_WIDTH + 30;
                y = Phaser.Math.Between(0, GameConfig.GAME_HEIGHT);
                break;
            case 2:
                x = Phaser.Math.Between(0, GameConfig.GAME_WIDTH);
                y = GameConfig.GAME_HEIGHT + 30;
                break;
            case 3:
                x = -30;
                y = Phaser.Math.Between(0, GameConfig.GAME_HEIGHT);
                break;
        }
        
        let zombie;
        const rand = Math.random();
        
        if (this.currentWave >= 3 && rand < 0.15) {
            zombie = new GiantZombie(this, x, y);
        } else if (this.currentWave >= 2 && rand < 0.4) {
            zombie = new FastZombie(this, x, y);
        } else {
            zombie = new NormalZombie(this, x, y);
        }
        
        this.zombies.push(zombie);
        this.updateZombiesRemainingUI();
    }
    
    update(time, delta) {
        if (this.gameOver) return;
        
        this.player.update();
        this.player.updateBullets(delta);
        
        this.updateZombies();
        this.checkCollisions();
        this.updateUI();
        this.checkWaveComplete();
    }
    
    updateZombies() {
        this.zombies.forEach(zombie => {
            if (!zombie.isDead) {
                zombie.update(this.player);
                zombie.attack(this.player);
            }
        });
        
        this.zombies = this.zombies.filter(zombie => !zombie.isDead);
    }
    
    checkCollisions() {
        const bullets = this.player.bullets.getChildren();
        
        bullets.forEach(bullet => {
            if (!bullet.active) return;
            
            this.zombies.forEach(zombie => {
                if (zombie.isDead) return;
                
                const distance = Phaser.Math.Distance.Between(
                    bullet.x, bullet.y,
                    zombie.sprite.x, zombie.sprite.y
                );
                
                if (distance < zombie.size + 5) {
                    bullet.active = false;
                    bullet.destroy();
                    zombie.takeDamage(bullet.damage);
                }
            });
        });
    }
    
    updateUI() {
        this.healthBarFill.scaleX = this.player.health / this.player.maxHealth;
        this.healthText.setText(Math.max(0, Math.floor(this.player.health)));
        
        this.ammoText.setText(`${this.player.ammo} / ${this.player.maxAmmo}`);
        
        if (this.player.health <= 30) {
            this.healthBarFill.setFillStyle(0xe74c3c);
        } else if (this.player.health <= 60) {
            this.healthBarFill.setFillStyle(0xf39c12);
        } else {
            this.healthBarFill.setFillStyle(0x2ecc71);
        }
    }
    
    updateScoreUI() {
        this.scoreText.setText(`分数: ${this.score}`);
    }
    
    updateZombiesRemainingUI() {
        const remaining = this.zombies.filter(z => !z.isDead).length + 
            (this.zombiesToSpawnInWave - this.zombiesSpawned);
        this.zombiesRemainingText.setText(`剩余僵尸: ${remaining}`);
    }
    
    checkWaveComplete() {
        if (!this.isWaveActive || this.isPreparing || this.gameOver) return;
        
        const allSpawned = this.zombiesSpawned >= this.zombiesToSpawnInWave;
        const allKilled = this.zombies.filter(z => !z.isDead).length === 0;
        
        if (allSpawned && allKilled) {
            this.completeWave();
        }
    }
    
    completeWave() {
        this.isWaveActive = false;
        
        if (this.currentWave >= GameConfig.WAVE.MAX_WAVES) {
            this.endGame(true);
        } else {
            this.currentWave++;
            this.waveText.setText(`波次: ${this.currentWave} / 5`);
            
            this.waveAnnouncement.setText(`波次 ${this.currentWave - 1} 完成!`);
            this.waveAnnouncement.setAlpha(1);
            
            this.tweens.add({
                targets: this.waveAnnouncement,
                alpha: 0,
                duration: 500,
                delay: 1500
            });
            
            this.time.delayedCall(2000, () => {
                this.startWavePreparation();
            });
        }
    }
    
    endGame(victory) {
        this.gameOver = true;
        this.isVictory = victory;
        
        this.scene.start('EndScene', {
            victory: victory,
            score: this.score,
            wave: this.currentWave
        });
    }
}
