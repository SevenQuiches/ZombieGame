import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, ZOMBIE_TYPES, WAVE_CONFIG } from '../GameConfig';
import type { GameState } from '../GameConfig';

interface Player {
  sprite: Phaser.Physics.Arcade.Sprite;
  health: number;
  maxHealth: number;
  ammo: number;
  maxAmmo: number;
  isReloading: boolean;
  lastShot: number;
  shootCooldown: number;
}

interface Zombie {
  sprite: Phaser.Physics.Arcade.Sprite;
  type: keyof typeof ZOMBIE_TYPES;
  health: number;
  maxHealth: number;
  healthBar: Phaser.GameObjects.Graphics;
  isDead: boolean;
  lastHitTime: number;
}

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private zombies!: Zombie[];
  private bullets!: Phaser.Physics.Arcade.Group;
  private gameState!: GameState;
  private zombiesRemaining!: number;
  private waveInProgress!: boolean;
  private prepareTime!: number;
  private isPreparing!: boolean;
  private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private healthBar!: Phaser.GameObjects.Graphics;
  private ammoText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private zombieHealthBars!: Map<Phaser.Physics.Arcade.Sprite, Zombie>;
  private zombieGroup!: Phaser.Physics.Arcade.Group;

  constructor() {
    super('GameScene');
  }

  create() {
    this.gameState = {
      currentWave: 0,
      score: 0,
      isGameOver: false,
      isVictory: false
    };

    this.zombies = [];
    this.waveInProgress = false;
    this.isPreparing = false;
    this.prepareTime = 5000;
    this.zombieHealthBars = new Map();

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x2a2a3a);

    this.createGrid();
    this.createPlayer();
    this.createBullets();
    this.createUI();
    this.createControls();

    this.time.delayedCall(1000, () => this.startNextWave());
    
    this.setupGlobalCollisions();
  }

  private setupGlobalCollisions() {
    this.zombieGroup = this.physics.add.group();
    
    this.physics.add.overlap(
      this.bullets,
      this.zombieGroup,
      (bullet, zombieSprite) => {
        const b = bullet as Phaser.Physics.Arcade.Sprite;
        const zs = zombieSprite as Phaser.Physics.Arcade.Sprite;
        
        if (!b.active || !zs.active) return;
        
        const zombie = this.zombieHealthBars.get(zs);
        if (zombie && !zombie.isDead) {
          b.setActive(false);
          b.setVisible(false);
          b.setVelocity(0, 0);
          this.hitZombieDirect(zombie);
        }
      },
      (bullet, zombieSprite) => {
        const b = bullet as Phaser.Physics.Arcade.Sprite;
        const zs = zombieSprite as Phaser.Physics.Arcade.Sprite;
        return b.active && zs.active;
      }
    );
  }

  private createGrid() {
    const gridSize = 50;
    for (let x = 0; x < GAME_WIDTH; x += gridSize) {
      this.add.line(x, 0, x, GAME_HEIGHT, 0x3a3a4a).setAlpha(0.3);
    }
    for (let y = 0; y < GAME_HEIGHT; y += gridSize) {
      this.add.line(0, y, GAME_WIDTH, y, 0x3a3a4a).setAlpha(0.3);
    }
  }

  private createPlayer() {
    const sprite = this.physics.add.sprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, '');
    sprite.setCircle(20);
    sprite.setCollideWorldBounds(true);
    
    const graphics = this.add.graphics();
    graphics.fillStyle(0x4488ff);
    graphics.fillCircle(0, 0, 20);
    graphics.fillStyle(0xffffff);
    graphics.fillCircle(8, -5, 6);
    graphics.fillCircle(-8, -5, 6);
    graphics.fillStyle(0x000000);
    graphics.fillCircle(10, -5, 3);
    graphics.fillCircle(-6, -5, 3);
    
    const textureKey = 'playerTexture';
    graphics.generateTexture(textureKey, 40, 40);
    graphics.destroy();
    
    sprite.setTexture(textureKey);
    sprite.setDepth(10);

    this.player = {
      sprite,
      health: 100,
      maxHealth: 100,
      ammo: 30,
      maxAmmo: 30,
      isReloading: false,
      lastShot: 0,
      shootCooldown: 150
    };
  }

  private createBullets() {
    this.bullets = this.physics.add.group({
      defaultKey: 'bullet',
      maxSize: 100
    });

    const bulletGraphics = this.add.graphics();
    bulletGraphics.fillStyle(0xffff00);
    bulletGraphics.fillCircle(0, 0, 5);
    bulletGraphics.generateTexture('bullet', 10, 10);
    bulletGraphics.destroy();
  }

  private createUI() {
    this.healthBar = this.add.graphics();
    this.updateHealthBar();

    this.ammoText = this.add.text(20, 50, '弹药: 30/30', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });

    this.waveText = this.add.text(GAME_WIDTH / 2, 20, '准备第 1 波...', {
      fontSize: '28px',
      color: '#ffaa00',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5);

    this.scoreText = this.add.text(GAME_WIDTH - 150, 20, '分数: 0', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial'
    });
  }

  private createControls() {
    this.keys = {
      w: this.input.keyboard!.addKey('W'),
      a: this.input.keyboard!.addKey('A'),
      s: this.input.keyboard!.addKey('S'),
      d: this.input.keyboard!.addKey('D'),
      r: this.input.keyboard!.addKey('R')
    };

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown() && !this.gameState.isGameOver && !this.isPreparing) {
        this.shoot();
      }
    });

    this.keys.r.on('down', () => {
      if (!this.player.isReloading && this.player.ammo < this.player.maxAmmo) {
        this.reload();
      }
    });
  }

  private updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.fillStyle(0x333333);
    this.healthBar.fillRect(20, 20, 200, 20);
    this.healthBar.fillStyle(0x44ff44);
    this.healthBar.fillRect(20, 20, (this.player.health / this.player.maxHealth) * 200, 20);
  }

  private updateAmmoText() {
    if (this.player.isReloading) {
      this.ammoText.setText('装弹中...');
    } else {
      this.ammoText.setText(`弹药: ${this.player.ammo}/${this.player.maxAmmo}`);
    }
  }

  private shoot() {
    const now = this.time.now;
    if (now - this.player.lastShot < this.player.shootCooldown) return;
    if (this.player.ammo <= 0 || this.player.isReloading) return;

    this.player.lastShot = now;
    this.player.ammo--;
    this.updateAmmoText();

    const pointer = this.input.activePointer;
    const angle = Phaser.Math.Angle.Between(
      this.player.sprite.x,
      this.player.sprite.y,
      pointer.worldX,
      pointer.worldY
    );

    const bullet = this.bullets.get(this.player.sprite.x, this.player.sprite.y) as Phaser.Physics.Arcade.Sprite;
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setCircle(5);
      bullet.setDepth(5);
      
      const speed = 800;
      bullet.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );

      this.time.delayedCall(2000, () => {
        bullet.setActive(false);
        bullet.setVisible(false);
      });
    }
  }

  private reload() {
    this.player.isReloading = true;
    this.updateAmmoText();
    
    this.time.delayedCall(1500, () => {
      this.player.ammo = this.player.maxAmmo;
      this.player.isReloading = false;
      this.updateAmmoText();
    });
  }

  private startNextWave() {
    if (this.gameState.currentWave >= WAVE_CONFIG.length) {
      this.victory();
      return;
    }

    this.gameState.currentWave++;
    this.isPreparing = true;
    this.waveText.setText(`第 ${this.gameState.currentWave} 波即将开始...`);
    this.waveText.setColor('#ffaa00');

    this.time.delayedCall(this.prepareTime, () => {
      this.isPreparing = false;
      this.spawnWave();
    });
  }

  private spawnWave() {
    const waveConfig = WAVE_CONFIG[this.gameState.currentWave - 1];
    const totalZombies = waveConfig.zombies;
    this.zombiesRemaining = totalZombies;
    this.waveInProgress = true;
    this.waveText.setText(`第 ${this.gameState.currentWave} 波 - 剩余: ${this.zombiesRemaining}`);
    this.waveText.setColor('#ff4444');

    let spawned = 0;
    const spawnInterval = setInterval(() => {
      if (spawned >= totalZombies || this.gameState.isGameOver) {
        clearInterval(spawnInterval);
        return;
      }

      const typeIndex = Phaser.Math.Between(0, waveConfig.types.length - 1);
      const zombieType = waveConfig.types[typeIndex] as keyof typeof ZOMBIE_TYPES;
      this.spawnZombie(zombieType);
      spawned++;
    }, 800);
  }

  private spawnZombie(type: keyof typeof ZOMBIE_TYPES) {
    const config = ZOMBIE_TYPES[type];
    
    let x, y;
    const side = Phaser.Math.Between(0, 3);
    switch (side) {
      case 0: x = Phaser.Math.Between(0, GAME_WIDTH); y = -50; break;
      case 1: x = GAME_WIDTH + 50; y = Phaser.Math.Between(0, GAME_HEIGHT); break;
      case 2: x = Phaser.Math.Between(0, GAME_WIDTH); y = GAME_HEIGHT + 50; break;
      default: x = -50; y = Phaser.Math.Between(0, GAME_HEIGHT); break;
    }

    const sprite = this.physics.add.sprite(x, y, '');
    sprite.setCircle(config.size);
    sprite.setCollideWorldBounds(false);
    
    if (this.zombieGroup) {
      this.zombieGroup.add(sprite);
    }

    const graphics = this.add.graphics();
    graphics.fillStyle(config.color);
    graphics.fillCircle(0, 0, config.size);
    graphics.fillStyle(0xff0000);
    graphics.fillCircle(config.size * 0.3, -config.size * 0.2, config.size * 0.2);
    graphics.fillCircle(-config.size * 0.3, -config.size * 0.2, config.size * 0.2);
    
    const textureKey = `zombie_${type}_${Date.now()}_${Math.random()}`;
    graphics.generateTexture(textureKey, config.size * 2, config.size * 2);
    graphics.destroy();
    
    sprite.setTexture(textureKey);
    sprite.setDepth(5);

    const healthBar = this.add.graphics();
    
    const zombie: Zombie = {
      sprite,
      type,
      health: config.health,
      maxHealth: config.health,
      healthBar,
      isDead: false,
      lastHitTime: 0
    };

    this.zombies.push(zombie);
    this.zombieHealthBars.set(sprite, zombie);
    this.updateZombieHealthBar(zombie);

    this.physics.add.overlap(this.player.sprite, sprite, () => {
      if (!zombie.isDead) {
        this.playerHit(type);
      }
    });
  }

  private hitZombieDirect(zombie: Zombie) {
    const now = this.time.now;
    if (zombie.isDead || zombie.health <= 0 || !zombie.sprite.active || now - zombie.lastHitTime < 50) return;
    
    zombie.lastHitTime = now;
    zombie.health -= 25;
    
    if (zombie.health > 0) {
      this.updateZombieHealthBar(zombie);
    }

    if (zombie.health <= 0) {
      this.killZombie(zombie);
    }
  }

  private updateZombieHealthBar(zombie: Zombie) {
    const healthBar = zombie.healthBar;
    if (!healthBar || !healthBar.scene || zombie.isDead || !zombie.sprite.active) return;

    const config = ZOMBIE_TYPES[zombie.type];
    const barWidth = config.size * 2;
    const barHeight = 6;
    const x = zombie.sprite.x - barWidth / 2;
    const y = zombie.sprite.y - config.size - 15;

    healthBar.clear();
    healthBar.fillStyle(0x333333);
    healthBar.fillRect(x, y, barWidth, barHeight);
    healthBar.fillStyle(0xff0000);
    healthBar.fillRect(x, y, (zombie.health / zombie.maxHealth) * barWidth, barHeight);
  }

  private killZombie(zombie: Zombie) {
    if (zombie.isDead) return;
    zombie.isDead = true;

    if (zombie.healthBar) {
      zombie.healthBar.clear();
      zombie.healthBar.destroy();
      zombie.healthBar = null as any;
    }
    this.zombieHealthBars.delete(zombie.sprite);

    const index = this.zombies.indexOf(zombie);
    const config = ZOMBIE_TYPES[zombie.type];
    this.gameState.score += config.points;
    this.scoreText.setText(`分数: ${this.gameState.score}`);

    if (this.zombieGroup) {
      this.zombieGroup.remove(zombie.sprite);
    }
    zombie.sprite.destroy();
    
    if (index !== -1) {
      this.zombies.splice(index, 1);
    }

    this.zombiesRemaining--;
    if (this.zombiesRemaining < 0) {
      this.zombiesRemaining = 0;
    }
    this.waveText.setText(`第 ${this.gameState.currentWave} 波 - 剩余: ${this.zombiesRemaining}`);
  }

  private cleanupZombies() {
    this.zombies.forEach(zombie => {
      if (zombie.healthBar) {
        zombie.healthBar.clear();
        zombie.healthBar.destroy();
      }
      if (zombie.sprite.active) {
        if (this.zombieGroup) {
          this.zombieGroup.remove(zombie.sprite);
        }
        zombie.sprite.destroy();
      }
    });
    this.zombies = [];
    this.zombieHealthBars.clear();
  }

  private playerHit(zombieType: keyof typeof ZOMBIE_TYPES) {
    const damage = ZOMBIE_TYPES[zombieType].damage;
    this.player.health -= damage;
    this.updateHealthBar();

    this.player.sprite.setTint(0xff0000);
    this.time.delayedCall(200, () => {
      this.player.sprite.clearTint();
    });

    if (this.player.health <= 0) {
      this.gameOver();
    }
  }

  private waveComplete() {
    this.waveInProgress = false;
    
    if (this.gameState.currentWave >= WAVE_CONFIG.length) {
      this.victory();
    } else {
      this.waveText.setText(`第 ${this.gameState.currentWave} 波完成！`);
      this.waveText.setColor('#44ff44');
      
      this.time.delayedCall(2000, () => {
        this.startNextWave();
      });
    }
  }

  private victory() {
    this.gameState.isVictory = true;
    this.gameState.isGameOver = true;
    this.scene.start('VictoryScene', { score: this.gameState.score });
  }

  private gameOver() {
    this.gameState.isGameOver = true;
    this.scene.start('GameOverScene', { score: this.gameState.score, wave: this.gameState.currentWave });
  }

  update() {
    if (this.gameState.isGameOver) return;

    this.updatePlayerMovement();
    this.updatePlayerRotation();
    
    if (this.waveInProgress) {
      this.updateZombies();
      this.updateZombieHealthBars();
      this.checkWaveComplete();
    }
  }

  private checkWaveComplete() {
    if (this.zombiesRemaining <= 0 && this.zombies.filter(z => !z.isDead).length === 0) {
      this.cleanupZombies();
      this.waveComplete();
    }
  }

  private updatePlayerMovement() {
    const speed = 300;
    let vx = 0;
    let vy = 0;

    if (this.keys.w.isDown) vy -= speed;
    if (this.keys.s.isDown) vy += speed;
    if (this.keys.a.isDown) vx -= speed;
    if (this.keys.d.isDown) vx += speed;

    if (vx !== 0 && vy !== 0) {
      const factor = Math.sqrt(2) / 2;
      vx *= factor;
      vy *= factor;
    }

    this.player.sprite.setVelocity(vx, vy);
  }

  private updatePlayerRotation() {
    const pointer = this.input.activePointer;
    const angle = Phaser.Math.Angle.Between(
      this.player.sprite.x,
      this.player.sprite.y,
      pointer.worldX,
      pointer.worldY
    );
    this.player.sprite.setRotation(angle);
  }

  private updateZombies() {
    this.zombies.forEach(zombie => {
      const config = ZOMBIE_TYPES[zombie.type];
      const angle = Phaser.Math.Angle.Between(
        zombie.sprite.x,
        zombie.sprite.y,
        this.player.sprite.x,
        this.player.sprite.y
      );
      
      zombie.sprite.setVelocity(
        Math.cos(angle) * config.speed * 60,
        Math.sin(angle) * config.speed * 60
      );
      
      zombie.sprite.setRotation(angle);
    });
  }

  private updateZombieHealthBars() {
    this.zombies.forEach(zombie => {
      if (zombie.isDead) {
        if (zombie.healthBar) {
          zombie.healthBar.destroy();
          zombie.healthBar = null as any;
        }
      } else if (zombie.healthBar) {
        this.updateZombieHealthBar(zombie);
      }
    });
  }
}
