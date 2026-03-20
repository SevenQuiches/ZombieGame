// 游戏配置
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#2d2d2d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene, VictoryScene]
};

// 创建游戏实例
const game = new Phaser.Game(config);

// 启动场景
function BootScene() {
    Phaser.Scene.call(this, { key: 'BootScene' });
}

BootScene.prototype = Object.create(Phaser.Scene.prototype);
BootScene.prototype.constructor = BootScene;

BootScene.prototype.preload = function() {
    // 创建纹理
    this.createTextures();
};

BootScene.prototype.createTextures = function() {
    // 玩家纹理
    const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    playerGraphics.fillStyle(0x3498db);
    playerGraphics.fillCircle(16, 16, 16);
    playerGraphics.fillStyle(0x2980b9);
    playerGraphics.fillCircle(16, 16, 12);
    playerGraphics.generateTexture('player', 32, 32);
    
    // 普通僵尸纹理
    const normalZombieGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    normalZombieGraphics.fillStyle(0x2ecc71);
    normalZombieGraphics.fillCircle(14, 14, 14);
    normalZombieGraphics.fillStyle(0x27ae60);
    normalZombieGraphics.fillCircle(14, 14, 10);
    normalZombieGraphics.fillStyle(0xe74c3c);
    normalZombieGraphics.fillCircle(14, 6, 4);
    normalZombieGraphics.generateTexture('zombie-normal', 28, 28);
    
    // 快速僵尸纹理
    const fastZombieGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    fastZombieGraphics.fillStyle(0xf39c12);
    fastZombieGraphics.fillCircle(12, 12, 12);
    fastZombieGraphics.fillStyle(0xe67e22);
    fastZombieGraphics.fillCircle(12, 12, 8);
    fastZombieGraphics.fillStyle(0xe74c3c);
    fastZombieGraphics.fillCircle(12, 5, 3);
    fastZombieGraphics.generateTexture('zombie-fast', 24, 24);
    
    // 巨型僵尸纹理
    const tankZombieGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    tankZombieGraphics.fillStyle(0x8e44ad);
    tankZombieGraphics.fillCircle(24, 24, 24);
    tankZombieGraphics.fillStyle(0x7d3c98);
    tankZombieGraphics.fillCircle(24, 24, 18);
    tankZombieGraphics.fillStyle(0xe74c3c);
    tankZombieGraphics.fillCircle(24, 10, 6);
    tankZombieGraphics.generateTexture('zombie-tank', 48, 48);
    
    // 子弹纹理
    const bulletGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    bulletGraphics.fillStyle(0xf1c40f);
    bulletGraphics.fillCircle(4, 4, 4);
    bulletGraphics.generateTexture('bullet', 8, 8);
    
    // 地面纹理
    const groundGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    groundGraphics.fillStyle(0x34495e);
    groundGraphics.fillRect(0, 0, 64, 64);
    groundGraphics.fillStyle(0x2c3e50);
    groundGraphics.fillRect(2, 2, 60, 60);
    groundGraphics.generateTexture('ground', 64, 64);
    
    // 障碍物纹理
    const obstacleGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    obstacleGraphics.fillStyle(0x7f8c8d);
    obstacleGraphics.fillRect(0, 0, 64, 64);
    obstacleGraphics.fillStyle(0x95a5a6);
    obstacleGraphics.fillRect(4, 4, 56, 56);
    obstacleGraphics.generateTexture('obstacle', 64, 64);
    
    // 血条背景
    const healthBgGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    healthBgGraphics.fillStyle(0x000000);
    healthBgGraphics.fillRect(0, 0, 40, 6);
    healthBgGraphics.generateTexture('health-bg', 40, 6);
    
    // 血条前景
    const healthFgGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    healthFgGraphics.fillStyle(0xe74c3c);
    healthFgGraphics.fillRect(0, 0, 40, 6);
    healthFgGraphics.generateTexture('health-fg', 40, 6);
    
    // 枪口火焰
    const muzzleFlashGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    muzzleFlashGraphics.fillStyle(0xf39c12);
    muzzleFlashGraphics.fillCircle(8, 8, 8);
    muzzleFlashGraphics.fillStyle(0xf1c40f);
    muzzleFlashGraphics.fillCircle(8, 8, 5);
    muzzleFlashGraphics.generateTexture('muzzle-flash', 16, 16);
    
    // 粒子纹理
    const particleGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    particleGraphics.fillStyle(0xe74c3c);
    particleGraphics.fillCircle(4, 4, 4);
    particleGraphics.generateTexture('particle', 8, 8);
};

BootScene.prototype.create = function() {
    this.scene.start('MenuScene');
};

// 菜单场景
function MenuScene() {
    Phaser.Scene.call(this, { key: 'MenuScene' });
}

MenuScene.prototype = Object.create(Phaser.Scene.prototype);
MenuScene.prototype.constructor = MenuScene;

MenuScene.prototype.create = function() {
    // 背景
    this.add.tileSprite(512, 384, 1024, 768, 'ground');
    
    // 标题
    const title = this.add.text(512, 200, '僵尸生存', {
        fontSize: '72px',
        fontFamily: 'Microsoft YaHei',
        fill: '#e74c3c',
        stroke: '#000000',
        strokeThickness: 6
    });
    title.setOrigin(0.5);
    
    // 副标题
    const subtitle = this.add.text(512, 280, '射击游戏', {
        fontSize: '36px',
        fontFamily: 'Microsoft YaHei',
        fill: '#ecf0f1',
        stroke: '#000000',
        strokeThickness: 3
    });
    subtitle.setOrigin(0.5);
    
    // 操作说明
    const instructions = this.add.text(512, 450, 
        'WASD - 移动\n鼠标 - 瞄准\n左键 - 射击\nR - 换弹', {
        fontSize: '24px',
        fontFamily: 'Microsoft YaHei',
        fill: '#bdc3c7',
        align: 'center'
    });
    instructions.setOrigin(0.5);
    
    // 开始按钮
    const startButton = this.add.text(512, 580, '开始游戏', {
        fontSize: '36px',
        fontFamily: 'Microsoft YaHei',
        fill: '#ffffff',
        backgroundColor: '#27ae60',
        padding: { x: 40, y: 15 }
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });
    
    startButton.on('pointerover', () => {
        startButton.setScale(1.1);
    });
    
    startButton.on('pointerout', () => {
        startButton.setScale(1);
    });
    
    startButton.on('pointerdown', () => {
        this.scene.start('GameScene');
    });
    
    // 游戏目标说明
    const goal = this.add.text(512, 680, '坚持到第5波结束即可获得胜利！', {
        fontSize: '20px',
        fontFamily: 'Microsoft YaHei',
        fill: '#f39c12'
    });
    goal.setOrigin(0.5);
};

// 游戏主场景
function GameScene() {
    Phaser.Scene.call(this, { key: 'GameScene' });
}

GameScene.prototype = Object.create(Phaser.Scene.prototype);
GameScene.prototype.constructor = GameScene;

GameScene.prototype.init = function() {
    this.player = null;
    this.zombies = null;
    this.bullets = null;
    this.obstacles = null;
    this.particles = null;
    
    this.wave = 1;
    this.maxWaves = 5;
    this.zombiesInWave = 0;
    this.zombiesSpawned = 0;
    this.zombiesKilled = 0;
    this.waveActive = false;
    this.waveCooldown = false;
    
    this.lastFired = 0;
    this.fireRate = 150;
    this.reloadTime = 1500;
    this.isReloading = false;
    this.ammo = 30;
    this.maxAmmo = 30;
    
    this.score = 0;
    this.gameOver = false;
};

GameScene.prototype.create = function() {
    // 创建地面
    this.add.tileSprite(512, 384, 1024, 768, 'ground');
    
    // 创建障碍物组
    this.obstacles = this.physics.add.staticGroup();
    this.createObstacles();
    
    // 创建玩家
    this.player = this.createPlayer();
    
    // 创建僵尸组
    this.zombies = this.physics.add.group();
    
    // 创建子弹组
    this.bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 50
    });
    
    // 创建粒子效果
    this.createParticles();
    
    // 设置碰撞
    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.zombies, this.obstacles);
    this.physics.add.collider(this.zombies, this.zombies);
    this.physics.add.overlap(this.bullets, this.zombies, this.hitZombie, null, this);
    this.physics.add.overlap(this.player, this.zombies, this.playerHit, null, this);
    
    // 输入控制
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.reloadKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    
    // UI
    this.createUI();
    
    // 开始第一波
    this.startWave();
};

GameScene.prototype.createObstacles = function() {
    // 创建一些障碍物
    const positions = [
        { x: 200, y: 200 },
        { x: 824, y: 200 },
        { x: 200, y: 568 },
        { x: 824, y: 568 },
        { x: 512, y: 384 }
    ];
    
    positions.forEach(pos => {
        this.obstacles.create(pos.x, pos.y, 'obstacle');
    });
};

GameScene.prototype.createPlayer = function() {
    const player = this.physics.add.sprite(512, 384, 'player');
    player.setCollideWorldBounds(true);
    player.setCircle(14, 2, 2);
    player.health = 100;
    player.maxHealth = 100;
    player.speed = 200;
    
    // 血条
    player.healthBarBg = this.add.sprite(0, 0, 'health-bg');
    player.healthBarFg = this.add.sprite(0, 0, 'health-fg');
    player.healthBarBg.setVisible(false);
    player.healthBarFg.setVisible(false);
    
    return player;
};

GameScene.prototype.createParticles = function() {
    this.particles = this.add.particles(0, 0, 'particle', {
        speed: { min: 50, max: 150 },
        scale: { start: 1, end: 0 },
        lifespan: 300,
        gravityY: 0,
        emitting: false
    });
};

GameScene.prototype.createUI = function() {
    // 生命值显示
    this.healthText = this.add.text(20, 20, '生命值: 100', {
        fontSize: '24px',
        fontFamily: 'Microsoft YaHei',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
    });
    
    // 弹药显示
    this.ammoText = this.add.text(20, 50, '弹药: 30/30', {
        fontSize: '24px',
        fontFamily: 'Microsoft YaHei',
        fill: '#f1c40f',
        stroke: '#000000',
        strokeThickness: 3
    });
    
    // 波次显示
    this.waveText = this.add.text(512, 20, '第 1 波', {
        fontSize: '32px',
        fontFamily: 'Microsoft YaHei',
        fill: '#e74c3c',
        stroke: '#000000',
        strokeThickness: 4
    });
    this.waveText.setOrigin(0.5, 0);
    
    // 剩余僵尸显示
    this.zombieText = this.add.text(512, 60, '剩余僵尸: 0', {
        fontSize: '20px',
        fontFamily: 'Microsoft YaHei',
        fill: '#bdc3c7',
        stroke: '#000000',
        strokeThickness: 2
    });
    this.zombieText.setOrigin(0.5, 0);
    
    // 分数显示
    this.scoreText = this.add.text(1004, 20, '分数: 0', {
        fontSize: '24px',
        fontFamily: 'Microsoft YaHei',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
    });
    this.scoreText.setOrigin(1, 0);
    
    // 波次间隔提示
    this.waveMessage = this.add.text(512, 384, '', {
        fontSize: '48px',
        fontFamily: 'Microsoft YaHei',
        fill: '#f39c12',
        stroke: '#000000',
        strokeThickness: 5
    });
    this.waveMessage.setOrigin(0.5);
    this.waveMessage.setVisible(false);
    
    // 换弹提示
    this.reloadText = this.add.text(512, 450, '换弹中...', {
        fontSize: '24px',
        fontFamily: 'Microsoft YaHei',
        fill: '#e74c3c',
        stroke: '#000000',
        strokeThickness: 3
    });
    this.reloadText.setOrigin(0.5);
    this.reloadText.setVisible(false);
};

GameScene.prototype.startWave = function() {
    if (this.wave > this.maxWaves) {
        this.scene.start('VictoryScene', { score: this.score });
        return;
    }
    
    this.waveActive = true;
    this.waveCooldown = false;
    this.zombiesSpawned = 0;
    this.zombiesKilled = 0;
    
    // 计算本波僵尸数量
    this.zombiesInWave = 5 + (this.wave - 1) * 5;
    
    this.waveText.setText('第 ' + this.wave + ' 波');
    this.updateZombieText();
    
    // 开始生成僵尸
    this.spawnZombies();
};

GameScene.prototype.spawnZombies = function() {
    if (!this.waveActive || this.gameOver) return;
    
    const spawnDelay = Math.max(500, 2000 - (this.wave - 1) * 300);
    
    this.spawnEvent = this.time.addEvent({
        delay: spawnDelay,
        callback: () => {
            if (this.zombiesSpawned < this.zombiesInWave && this.waveActive) {
                this.spawnZombie();
                this.zombiesSpawned++;
            }
        },
        callbackScope: this,
        repeat: this.zombiesInWave - 1
    });
};

GameScene.prototype.spawnZombie = function() {
    // 随机选择生成位置（在屏幕边缘）
    const side = Phaser.Math.Between(0, 3);
    let x, y;
    
    switch(side) {
        case 0: // 上
            x = Phaser.Math.Between(0, 1024);
            y = -30;
            break;
        case 1: // 右
            x = 1054;
            y = Phaser.Math.Between(0, 768);
            break;
        case 2: // 下
            x = Phaser.Math.Between(0, 1024);
            y = 798;
            break;
        case 3: // 左
            x = -30;
            y = Phaser.Math.Between(0, 768);
            break;
    }
    
    // 根据波次决定僵尸类型
    let zombieType = 'normal';
    const rand = Math.random();
    
    if (this.wave >= 3 && rand < 0.2) {
        zombieType = 'tank';
    } else if (this.wave >= 2 && rand < 0.4) {
        zombieType = 'fast';
    }
    
    this.createZombie(x, y, zombieType);
};

GameScene.prototype.createZombie = function(x, y, type) {
    let texture, health, speed, damage, scoreValue;
    
    switch(type) {
        case 'fast':
            texture = 'zombie-fast';
            health = 30;
            speed = 120;
            damage = 8;
            scoreValue = 20;
            break;
        case 'tank':
            texture = 'zombie-tank';
            health = 150;
            speed = 50;
            damage = 20;
            scoreValue = 50;
            break;
        default: // normal
            texture = 'zombie-normal';
            health = 50;
            speed = 70;
            damage = 10;
            scoreValue = 10;
    }
    
    const zombie = this.zombies.create(x, y, texture);
    zombie.setCircle(zombie.width / 2 - 2, 2, 2);
    zombie.zombieType = type;
    zombie.health = health;
    zombie.maxHealth = health;
    zombie.speed = speed;
    zombie.damage = damage;
    zombie.scoreValue = scoreValue;
    zombie.lastAttack = 0;
    zombie.attackCooldown = 1000;
    
    // 血条
    zombie.healthBarBg = this.add.sprite(x, y - zombie.height / 2 - 10, 'health-bg');
    zombie.healthBarFg = this.add.sprite(x, y - zombie.height / 2 - 10, 'health-fg');
    zombie.healthBarBg.setVisible(false);
    zombie.healthBarFg.setVisible(false);
    
    this.updateZombieText();
};

GameScene.prototype.update = function(time, delta) {
    if (this.gameOver) return;
    
    // 玩家移动
    this.updatePlayerMovement();
    
    // 玩家瞄准
    this.updatePlayerAim();
    
    // 射击
    if (this.input.activePointer.isDown && !this.isReloading) {
        this.fire(time);
    }
    
    // 换弹
    if (Phaser.Input.Keyboard.JustDown(this.reloadKey) && !this.isReloading && this.ammo < this.maxAmmo) {
        this.reload();
    }
    
    // 自动换弹
    if (this.ammo === 0 && !this.isReloading) {
        this.reload();
    }
    
    // 更新僵尸
    this.updateZombies(time);
    
    // 更新子弹
    this.updateBullets();
    
    // 检查波次结束
    this.checkWaveEnd();
    
    // 更新血条位置
    this.updateHealthBars();
};

GameScene.prototype.updatePlayerMovement = function() {
    let velocityX = 0;
    let velocityY = 0;
    
    if (this.wasd.left.isDown) velocityX = -this.player.speed;
    if (this.wasd.right.isDown) velocityX = this.player.speed;
    if (this.wasd.up.isDown) velocityY = -this.player.speed;
    if (this.wasd.down.isDown) velocityY = this.player.speed;
    
    // 对角线移动速度限制
    if (velocityX !== 0 && velocityY !== 0) {
        velocityX *= 0.707;
        velocityY *= 0.707;
    }
    
    this.player.setVelocity(velocityX, velocityY);
};

GameScene.prototype.updatePlayerAim = function() {
    const pointer = this.input.activePointer;
    const angle = Phaser.Math.Angle.Between(
        this.player.x, this.player.y,
        pointer.x, pointer.y
    );
    this.player.setRotation(angle);
};

GameScene.prototype.fire = function(time) {
    if (time - this.lastFired < this.fireRate) return;
    if (this.ammo <= 0) return;
    
    this.ammo--;
    this.updateAmmoText();
    
    const bullet = this.bullets.get(this.player.x, this.player.y);
    
    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        
        const pointer = this.input.activePointer;
        const angle = Phaser.Math.Angle.Between(
            this.player.x, this.player.y,
            pointer.x, pointer.y
        );
        
        const velocity = this.physics.velocityFromRotation(angle, 600);
        bullet.setVelocity(velocity.x, velocity.y);
        bullet.setRotation(angle);
        
        // 枪口火焰效果
        this.createMuzzleFlash();
        
        this.lastFired = time;
    }
};

GameScene.prototype.createMuzzleFlash = function() {
    const flash = this.add.sprite(
        this.player.x + Math.cos(this.player.rotation) * 25,
        this.player.y + Math.sin(this.player.rotation) * 25,
        'muzzle-flash'
    );
    flash.setRotation(this.player.rotation);
    
    this.tweens.add({
        targets: flash,
        alpha: 0,
        scale: 0.5,
        duration: 100,
        onComplete: () => flash.destroy()
    });
};

GameScene.prototype.reload = function() {
    this.isReloading = true;
    this.reloadText.setVisible(true);
    
    this.time.delayedCall(this.reloadTime, () => {
        this.ammo = this.maxAmmo;
        this.isReloading = false;
        this.reloadText.setVisible(false);
        this.updateAmmoText();
    });
};

GameScene.prototype.updateZombies = function(time) {
    this.zombies.children.entries.forEach(zombie => {
        if (!zombie.active) return;
        
        // 朝向玩家移动
        const angle = Phaser.Math.Angle.Between(
            zombie.x, zombie.y,
            this.player.x, this.player.y
        );
        
        zombie.setRotation(angle);
        
        const velocity = this.physics.velocityFromRotation(angle, zombie.speed);
        zombie.setVelocity(velocity.x, velocity.y);
        
        // 更新血条位置
        zombie.healthBarBg.x = zombie.x;
        zombie.healthBarBg.y = zombie.y - zombie.height / 2 - 10;
        zombie.healthBarFg.x = zombie.x - (1 - zombie.health / zombie.maxHealth) * 20;
        zombie.healthBarFg.y = zombie.y - zombie.height / 2 - 10;
        zombie.healthBarFg.setScale(zombie.health / zombie.maxHealth, 1);
    });
};

GameScene.prototype.updateBullets = function() {
    this.bullets.children.entries.forEach(bullet => {
        if (bullet.active) {
            // 检查是否超出边界
            if (bullet.x < 0 || bullet.x > 1024 || bullet.y < 0 || bullet.y > 768) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        }
    });
};

GameScene.prototype.hitZombie = function(bullet, zombie) {
    if (!bullet.active || !zombie.active) return;
    
    bullet.setActive(false);
    bullet.setVisible(false);
    
    // 伤害计算
    let damage = 25;
    zombie.health -= damage;
    
    // 显示血条
    zombie.healthBarBg.setVisible(true);
    zombie.healthBarFg.setVisible(true);
    
    // 粒子效果
    this.particles.emitParticleAt(bullet.x, bullet.y, 5);
    
    if (zombie.health <= 0) {
        this.killZombie(zombie);
    }
};

GameScene.prototype.killZombie = function(zombie) {
    // 死亡粒子效果
    this.particles.emitParticleAt(zombie.x, zombie.y, 10);
    
    // 移除血条
    zombie.healthBarBg.destroy();
    zombie.healthBarFg.destroy();
    
    // 增加分数
    this.score += zombie.scoreValue;
    this.scoreText.setText('分数: ' + this.score);
    
    // 销毁僵尸
    zombie.destroy();
    
    this.zombiesKilled++;
    this.updateZombieText();
};

GameScene.prototype.playerHit = function(player, zombie) {
    const time = this.time.now;
    
    if (time - zombie.lastAttack < zombie.attackCooldown) return;
    
    zombie.lastAttack = time;
    
    player.health -= zombie.damage;
    this.healthText.setText('生命值: ' + Math.max(0, player.health));
    
    // 受伤闪烁效果
    this.tweens.add({
        targets: player,
        alpha: 0.5,
        duration: 100,
        yoyo: true,
        repeat: 2
    });
    
    // 击退效果
    const angle = Phaser.Math.Angle.Between(zombie.x, zombie.y, player.x, player.y);
    const knockback = this.physics.velocityFromRotation(angle, 200);
    player.setVelocity(knockback.x, knockback.y);
    
    if (player.health <= 0) {
        this.playerDied();
    }
};

GameScene.prototype.playerDied = function() {
    this.gameOver = true;
    this.scene.start('GameOverScene', { 
        score: this.score, 
        wave: this.wave 
    });
};

GameScene.prototype.checkWaveEnd = function() {
    if (!this.waveActive || this.waveCooldown) return;
    
    const activeZombies = this.zombies.countActive();
    
    if (this.zombiesSpawned >= this.zombiesInWave && activeZombies === 0) {
        this.waveActive = false;
        
        if (this.wave >= this.maxWaves) {
            this.scene.start('VictoryScene', { score: this.score });
        } else {
            this.startWaveCooldown();
        }
    }
};

GameScene.prototype.startWaveCooldown = function() {
    this.waveCooldown = true;
    
    this.waveMessage.setText('第 ' + (this.wave + 1) + ' 波准备中...');
    this.waveMessage.setVisible(true);
    
    this.time.delayedCall(3000, () => {
        this.wave++;
        this.waveMessage.setVisible(false);
        this.startWave();
    });
};

GameScene.prototype.updateZombieText = function() {
    const remaining = this.zombiesInWave - this.zombiesKilled;
    this.zombieText.setText('剩余僵尸: ' + remaining);
};

GameScene.prototype.updateAmmoText = function() {
    this.ammoText.setText('弹药: ' + this.ammo + '/' + this.maxAmmo);
};

GameScene.prototype.updateHealthBars = function() {
    if (this.player.health < this.player.maxHealth) {
        this.player.healthBarBg.setVisible(true);
        this.player.healthBarFg.setVisible(true);
        this.player.healthBarBg.x = this.player.x;
        this.player.healthBarBg.y = this.player.y - 30;
        this.player.healthBarFg.x = this.player.x - (1 - this.player.health / this.player.maxHealth) * 20;
        this.player.healthBarFg.y = this.player.y - 30;
        this.player.healthBarFg.setScale(this.player.health / this.player.maxHealth, 1);
    } else {
        this.player.healthBarBg.setVisible(false);
        this.player.healthBarFg.setVisible(false);
    }
};

// 游戏结束场景
function GameOverScene() {
    Phaser.Scene.call(this, { key: 'GameOverScene' });
}

GameOverScene.prototype = Object.create(Phaser.Scene.prototype);
GameOverScene.prototype.constructor = GameOverScene;

GameOverScene.prototype.init = function(data) {
    this.finalScore = data.score || 0;
    this.finalWave = data.wave || 1;
};

GameOverScene.prototype.create = function() {
    // 背景
    this.add.tileSprite(512, 384, 1024, 768, 'ground');
    
    // 游戏结束标题
    const title = this.add.text(512, 250, '游戏结束', {
        fontSize: '72px',
        fontFamily: 'Microsoft YaHei',
        fill: '#e74c3c',
        stroke: '#000000',
        strokeThickness: 6
    });
    title.setOrigin(0.5);
    
    // 统计信息
    const stats = this.add.text(512, 380, 
        '存活波次: ' + this.finalWave + '\n最终分数: ' + this.finalScore, {
        fontSize: '32px',
        fontFamily: 'Microsoft YaHei',
        fill: '#ecf0f1',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 3
    });
    stats.setOrigin(0.5);
    
    // 重新开始按钮
    const restartButton = this.add.text(512, 520, '重新开始', {
        fontSize: '36px',
        fontFamily: 'Microsoft YaHei',
        fill: '#ffffff',
        backgroundColor: '#3498db',
        padding: { x: 40, y: 15 }
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });
    
    restartButton.on('pointerover', () => {
        restartButton.setScale(1.1);
    });
    
    restartButton.on('pointerout', () => {
        restartButton.setScale(1);
    });
    
    restartButton.on('pointerdown', () => {
        this.scene.start('GameScene');
    });
    
    // 主菜单按钮
    const menuButton = this.add.text(512, 600, '主菜单', {
        fontSize: '28px',
        fontFamily: 'Microsoft YaHei',
        fill: '#ffffff',
        backgroundColor: '#7f8c8d',
        padding: { x: 30, y: 10 }
    });
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });
    
    menuButton.on('pointerover', () => {
        menuButton.setScale(1.1);
    });
    
    menuButton.on('pointerout', () => {
        menuButton.setScale(1);
    });
    
    menuButton.on('pointerdown', () => {
        this.scene.start('MenuScene');
    });
};

// 胜利场景
function VictoryScene() {
    Phaser.Scene.call(this, { key: 'VictoryScene' });
}

VictoryScene.prototype = Object.create(Phaser.Scene.prototype);
VictoryScene.prototype.constructor = VictoryScene;

VictoryScene.prototype.init = function(data) {
    this.finalScore = data.score || 0;
};

VictoryScene.prototype.create = function() {
    // 背景
    this.add.tileSprite(512, 384, 1024, 768, 'ground');
    
    // 胜利标题
    const title = this.add.text(512, 200, '胜利！', {
        fontSize: '80px',
        fontFamily: 'Microsoft YaHei',
        fill: '#f1c40f',
        stroke: '#000000',
        strokeThickness: 6
    });
    title.setOrigin(0.5);
    
    // 胜利描述
    const description = this.add.text(512, 300, '你成功存活了所有波次！', {
        fontSize: '32px',
        fontFamily: 'Microsoft YaHei',
        fill: '#2ecc71',
        stroke: '#000000',
        strokeThickness: 3
    });
    description.setOrigin(0.5);
    
    // 分数
    const scoreText = this.add.text(512, 380, '最终分数: ' + this.finalScore, {
        fontSize: '40px',
        fontFamily: 'Microsoft YaHei',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
    });
    scoreText.setOrigin(0.5);
    
    // 庆祝效果
    this.createCelebration();
    
    // 重新开始按钮
    const restartButton = this.add.text(512, 520, '再次挑战', {
        fontSize: '36px',
        fontFamily: 'Microsoft YaHei',
        fill: '#ffffff',
        backgroundColor: '#27ae60',
        padding: { x: 40, y: 15 }
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });
    
    restartButton.on('pointerover', () => {
        restartButton.setScale(1.1);
    });
    
    restartButton.on('pointerout', () => {
        restartButton.setScale(1);
    });
    
    restartButton.on('pointerdown', () => {
        this.scene.start('GameScene');
    });
    
    // 主菜单按钮
    const menuButton = this.add.text(512, 600, '主菜单', {
        fontSize: '28px',
        fontFamily: 'Microsoft YaHei',
        fill: '#ffffff',
        backgroundColor: '#7f8c8d',
        padding: { x: 30, y: 10 }
    });
    menuButton.setOrigin(0.5);
    menuButton.setInteractive({ useHandCursor: true });
    
    menuButton.on('pointerover', () => {
        menuButton.setScale(1.1);
    });
    
    menuButton.on('pointerout', () => {
        menuButton.setScale(1);
    });
    
    menuButton.on('pointerdown', () => {
        this.scene.start('MenuScene');
    });
};

VictoryScene.prototype.createCelebration = function() {
    // 创建简单的庆祝粒子效果
    const colors = [0xf1c40f, 0xe74c3c, 0x3498db, 0x2ecc71, 0x9b59b6];
    
    for (let i = 0; i < 50; i++) {
        const x = Phaser.Math.Between(100, 924);
        const y = Phaser.Math.Between(100, 668);
        const color = Phaser.Utils.Array.GetRandom(colors);
        
        const particle = this.add.circle(x, y, Phaser.Math.Between(4, 8), color);
        
        this.tweens.add({
            targets: particle,
            y: y - Phaser.Math.Between(100, 300),
            alpha: 0,
            duration: Phaser.Math.Between(1000, 2000),
            ease: 'Power2',
            onComplete: () => particle.destroy()
        });
    }
};
