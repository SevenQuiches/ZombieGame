class Zombie {
    constructor(scene, x, y, config) {
        this.scene = scene;
        this.config = config;
        this.health = config.HEALTH;
        this.maxHealth = config.HEALTH;
        this.speed = config.SPEED;
        this.damage = config.DAMAGE;
        this.score = config.SCORE;
        this.size = config.SIZE;
        this.color = config.COLOR;
        this.isDead = false;
        this.canAttack = true;
        this.attackCooldown = 1000;
        
        this.sprite = scene.add.graphics();
        this.sprite.x = x;
        this.sprite.y = y;
        this.drawZombie();
        
        this.createHealthBar();
    }
    
    drawZombie() {
        this.sprite.clear();
        
        this.sprite.fillStyle(this.color, 1);
        this.sprite.fillCircle(0, 0, this.size);
        
        this.sprite.fillStyle(Phaser.Display.Color.IntegerToColor(this.color).darken(20).color, 1);
        this.sprite.fillCircle(0, 0, this.size * 0.6);
        
        this.sprite.lineStyle(2, 0x000000, 0.5);
        this.sprite.strokeCircle(0, 0, this.size);
        
        this.drawEyes();
    }
    
    drawEyes() {
        const eyeOffset = this.size * 0.3;
        const eyeSize = this.size * 0.15;
        
        this.sprite.fillStyle(0xff0000, 1);
        this.sprite.fillCircle(-eyeOffset, -eyeOffset * 0.5, eyeSize);
        this.sprite.fillCircle(eyeOffset, -eyeOffset * 0.5, eyeSize);
    }
    
    createHealthBar() {
        this.healthBarBg = this.scene.add.graphics();
        this.healthBarBg.fillStyle(0x333333, 0.8);
        this.healthBarBg.fillRect(-this.size, -this.size - 10, this.size * 2, 4);
        
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();
    }
    
    updateHealthBar() {
        this.healthBar.clear();
        const healthPercent = this.health / this.maxHealth;
        this.healthBar.fillStyle(0xe74c3c, 1);
        this.healthBar.fillRect(-this.size, -this.size - 10, this.size * 2 * healthPercent, 4);
    }
    
    update(player) {
        if (this.isDead) return;
        
        this.moveTowardsPlayer(player);
        this.updateHealthBarPosition();
    }
    
    moveTowardsPlayer(player) {
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
        
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
        
        if (distance > this.size + 15) {
            const velocityX = Math.cos(angle) * this.speed;
            const velocityY = Math.sin(angle) * this.speed;
            
            this.sprite.x += velocityX * this.scene.game.loop.delta / 1000;
            this.sprite.y += velocityY * this.scene.game.loop.delta / 1000;
        }
    }
    
    updateHealthBarPosition() {
        this.healthBarBg.x = this.sprite.x;
        this.healthBarBg.y = this.sprite.y;
        this.healthBar.x = this.sprite.x;
        this.healthBar.y = this.sprite.y;
    }
    
    takeDamage(amount) {
        if (this.isDead) return false;
        
        this.health -= amount;
        this.updateHealthBar();
        
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.3,
            duration: 50,
            yoyo: true
        });
        
        if (this.health <= 0) {
            this.die();
            return true;
        }
        return false;
    }
    
    attack(player) {
        if (!this.canAttack || this.isDead || player.isDead) return;
        
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
        
        if (distance < this.size + 20) {
            player.takeDamage(this.damage);
            this.canAttack = false;
            
            this.scene.time.delayedCall(this.attackCooldown, () => {
                this.canAttack = true;
            });
        }
    }
    
    die() {
        this.isDead = true;
        
        this.scene.tweens.add({
            targets: [this.sprite, this.healthBar, this.healthBarBg],
            alpha: 0,
            scale: 1.5,
            duration: 200,
            onComplete: () => {
                this.destroy();
            }
        });
        
        this.scene.events.emit('zombie-killed', this.score);
    }
    
    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
    }
    
    getDistanceToPlayer(player) {
        return Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
    }
}

class NormalZombie extends Zombie {
    constructor(scene, x, y) {
        super(scene, x, y, GameConfig.ZOMBIE.NORMAL);
        this.type = 'normal';
    }
}

class FastZombie extends Zombie {
    constructor(scene, x, y) {
        super(scene, x, y, GameConfig.ZOMBIE.FAST);
        this.type = 'fast';
        this.attackCooldown = 800;
    }
    
    drawZombie() {
        this.sprite.clear();
        
        this.sprite.fillStyle(this.color, 1);
        
        this.sprite.beginPath();
        this.sprite.moveTo(0, -this.size);
        this.sprite.lineTo(this.size, this.size);
        this.sprite.lineTo(-this.size, this.size);
        this.sprite.closePath();
        this.sprite.fillPath();
        
        this.sprite.lineStyle(2, 0x000000, 0.5);
        this.sprite.strokePath();
        
        this.drawEyes();
    }
    
    drawEyes() {
        const eyeSize = this.size * 0.12;
        
        this.sprite.fillStyle(0xffff00, 1);
        this.sprite.fillCircle(0, 0, eyeSize);
    }
    
    moveTowardsPlayer(player) {
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
        
        const distance = this.getDistanceToPlayer(player);
        
        if (distance > this.size + 15) {
            const wobble = Math.sin(this.scene.time.now * 0.01) * 0.3;
            const finalAngle = angle + wobble;
            
            const velocityX = Math.cos(finalAngle) * this.speed;
            const velocityY = Math.sin(finalAngle) * this.speed;
            
            this.sprite.x += velocityX * this.scene.game.loop.delta / 1000;
            this.sprite.y += velocityY * this.scene.game.loop.delta / 1000;
        }
    }
}

class GiantZombie extends Zombie {
    constructor(scene, x, y) {
        super(scene, x, y, GameConfig.ZOMBIE.GIANT);
        this.type = 'giant';
        this.attackCooldown = 1500;
        this.chargeSpeed = this.speed * 2;
        this.isCharging = false;
        this.chargeTimer = 0;
    }
    
    drawZombie() {
        this.sprite.clear();
        
        this.sprite.fillStyle(this.color, 1);
        this.sprite.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
        
        this.sprite.fillStyle(Phaser.Display.Color.IntegerToColor(this.color).darken(30).color, 1);
        this.sprite.fillRect(-this.size * 0.7, -this.size * 0.7, this.size * 1.4, this.size * 1.4);
        
        this.sprite.lineStyle(3, 0x000000, 0.5);
        this.sprite.strokeRect(-this.size, -this.size, this.size * 2, this.size * 2);
        
        this.drawEyes();
    }
    
    drawEyes() {
        const eyeOffset = this.size * 0.4;
        const eyeSize = this.size * 0.2;
        
        this.sprite.fillStyle(0xff6600, 1);
        this.sprite.fillCircle(-eyeOffset, -eyeOffset * 0.3, eyeSize);
        this.sprite.fillCircle(eyeOffset, -eyeOffset * 0.3, eyeSize);
        
        this.sprite.fillStyle(0x000000, 1);
        this.sprite.fillCircle(-eyeOffset, -eyeOffset * 0.3, eyeSize * 0.5);
        this.sprite.fillCircle(eyeOffset, -eyeOffset * 0.3, eyeSize * 0.5);
    }
    
    update(player) {
        if (this.isDead) return;
        
        this.chargeTimer += this.scene.game.loop.delta;
        
        if (this.chargeTimer > 3000) {
            this.isCharging = true;
            
            this.scene.time.delayedCall(500, () => {
                this.isCharging = false;
                this.chargeTimer = 0;
            });
        }
        
        this.moveTowardsPlayer(player);
        this.updateHealthBarPosition();
    }
    
    moveTowardsPlayer(player) {
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
        
        const distance = this.getDistanceToPlayer(player);
        
        if (distance > this.size + 15) {
            const currentSpeed = this.isCharging ? this.chargeSpeed : this.speed;
            
            const velocityX = Math.cos(angle) * currentSpeed;
            const velocityY = Math.sin(angle) * currentSpeed;
            
            this.sprite.x += velocityX * this.scene.game.loop.delta / 1000;
            this.sprite.y += velocityY * this.scene.game.loop.delta / 1000;
            
            if (this.isCharging) {
                this.scene.tweens.add({
                    targets: this.sprite,
                    alpha: 0.7,
                    duration: 50,
                    yoyo: true
                });
            }
        }
    }
}
