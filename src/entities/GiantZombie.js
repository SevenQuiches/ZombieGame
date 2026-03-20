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
