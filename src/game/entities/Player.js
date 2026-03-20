class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.health = GameConfig.PLAYER.MAX_HEALTH;
        this.maxHealth = GameConfig.PLAYER.MAX_HEALTH;
        this.ammo = GameConfig.PLAYER.MAX_AMMO;
        this.maxAmmo = GameConfig.PLAYER.MAX_AMMO;
        this.isReloading = false;
        this.canShoot = true;
        this.isDead = false;
        
        this.sprite = scene.add.graphics();
        this.sprite.x = x;
        this.sprite.y = y;
        this.drawPlayer();
        
        this.createHealthBar();
        
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        this.reloadKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        
        this.bullets = scene.add.group();
    }
    
    drawPlayer() {
        this.sprite.clear();
        
        this.sprite.fillStyle(GameConfig.COLORS.PLAYER, 1);
        this.sprite.fillCircle(0, 0, 15);
        
        this.sprite.fillStyle(0x2980b9, 1);
        this.sprite.fillCircle(0, 0, 10);
        
        this.sprite.lineStyle(2, 0xffffff, 0.8);
        this.sprite.strokeCircle(0, 0, 15);
    }
    
    createHealthBar() {
        this.healthBarBg = this.scene.add.graphics();
        this.healthBarBg.fillStyle(0x333333, 1);
        this.healthBarBg.fillRect(-25, -30, 50, 6);
        
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
    }
    
    updateHealthBar() {
        this.healthBar.clear();
        const healthPercent = this.health / this.maxHealth;
        const color = healthPercent > 0.5 ? 0x2ecc71 : (healthPercent > 0.25 ? 0xf39c12 : 0xe74c3c);
        this.healthBar.fillStyle(color, 1);
        this.healthBar.fillRect(-25, -30, 50 * healthPercent, 6);
    }
    
    update() {
        if (this.isDead) return;
        
        this.handleMovement();
        this.handleRotation();
        this.handleShooting();
        this.handleReload();
        
        this.healthBarBg.x = this.sprite.x;
        this.healthBarBg.y = this.sprite.y;
        this.healthBar.x = this.sprite.x;
        this.healthBar.y = this.sprite.y;
        
        this.constrainToWorld();
    }
    
    handleMovement() {
        let velocityX = 0;
        let velocityY = 0;
        
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            velocityX = -GameConfig.PLAYER.SPEED;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            velocityX = GameConfig.PLAYER.SPEED;
        }
        
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            velocityY = -GameConfig.PLAYER.SPEED;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            velocityY = GameConfig.PLAYER.SPEED;
        }
        
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }
        
        this.sprite.x += velocityX * this.scene.game.loop.delta / 1000;
        this.sprite.y += velocityY * this.scene.game.loop.delta / 1000;
    }
    
    handleRotation() {
        const pointer = this.scene.input.activePointer;
        const camera = this.scene.cameras.main;
        const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            worldPoint.x, worldPoint.y
        );
        this.rotation = angle;
    }
    
    handleShooting() {
        const pointer = this.scene.input.activePointer;
        if (pointer.leftButtonDown() && this.canShoot && !this.isReloading && this.ammo > 0) {
            this.shoot();
        }
    }
    
    shoot() {
        this.canShoot = false;
        this.ammo--;
        
        const bullet = this.scene.add.graphics();
        bullet.fillStyle(GameConfig.COLORS.BULLET, 1);
        bullet.fillCircle(0, 0, 5);
        bullet.lineStyle(1, 0xffffff, 0.5);
        bullet.strokeCircle(0, 0, 5);
        
        const spawnDistance = 20;
        bullet.x = this.sprite.x + Math.cos(this.rotation) * spawnDistance;
        bullet.y = this.sprite.y + Math.sin(this.rotation) * spawnDistance;
        
        bullet.damage = GameConfig.PLAYER.BULLET_DAMAGE;
        bullet.velocityX = Math.cos(this.rotation) * GameConfig.PLAYER.BULLET_SPEED;
        bullet.velocityY = Math.sin(this.rotation) * GameConfig.PLAYER.BULLET_SPEED;
        bullet.active = true;
        
        this.bullets.add(bullet);
        
        this.scene.time.delayedCall(GameConfig.PLAYER.FIRE_RATE, () => {
            this.canShoot = true;
        });
        
        if (this.ammo === 0 && !this.isReloading) {
            this.reload();
        }
    }
    
    handleReload() {
        if (Phaser.Input.Keyboard.JustDown(this.reloadKey) && !this.isReloading && this.ammo < this.maxAmmo) {
            this.reload();
        }
    }
    
    reload() {
        this.isReloading = true;
        
        this.scene.events.emit('reload-start');
        
        this.scene.time.delayedCall(GameConfig.PLAYER.RELOAD_TIME, () => {
            this.ammo = this.maxAmmo;
            this.isReloading = false;
            this.scene.events.emit('reload-complete');
        });
    }
    
    takeDamage(amount) {
        if (this.isDead) return;
        
        this.health -= amount;
        this.updateHealthBar();
        
        this.scene.cameras.main.shake(100, 0.01);
        
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.5,
            duration: 50,
            yoyo: true,
            repeat: 2
        });
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        this.isDead = true;
        this.scene.events.emit('player-death');
    }
    
    constrainToWorld() {
        const padding = 20;
        this.sprite.x = Phaser.Math.Clamp(
            this.sprite.x,
            padding,
            GameConfig.GAME_WIDTH - padding
        );
        this.sprite.y = Phaser.Math.Clamp(
            this.sprite.y,
            padding,
            GameConfig.GAME_HEIGHT - padding
        );
    }
    
    updateBullets(delta) {
        this.bullets.getChildren().forEach(bullet => {
            if (!bullet.active) return;
            
            bullet.x += bullet.velocityX * delta / 1000;
            bullet.y += bullet.velocityY * delta / 1000;
            
            if (bullet.x < 0 || bullet.x > GameConfig.GAME_WIDTH ||
                bullet.y < 0 || bullet.y > GameConfig.GAME_HEIGHT) {
                bullet.active = false;
                bullet.destroy();
            }
        });
    }
    
    destroy() {
        this.sprite.destroy();
        this.healthBarBg.destroy();
        this.healthBar.destroy();
        this.bullets.destroy();
    }
}
