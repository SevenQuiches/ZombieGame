class NormalZombie extends Zombie {
    constructor(scene, x, y) {
        super(scene, x, y, GameConfig.ZOMBIE.NORMAL);
        this.type = 'normal';
    }
    
    drawEyes() {
        const eyeOffset = this.size * 0.3;
        const eyeSize = this.size * 0.15;
        
        this.sprite.fillStyle(0xff0000, 1);
        this.sprite.fillCircle(-eyeOffset, -eyeOffset * 0.5, eyeSize);
        this.sprite.fillCircle(eyeOffset, -eyeOffset * 0.5, eyeSize);
    }
}
