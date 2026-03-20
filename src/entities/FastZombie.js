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
