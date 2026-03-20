console.log('GameConfig loaded:', GameConfig);
console.log('Phaser version:', Phaser.VERSION);

const config = {
    type: Phaser.AUTO,
    width: GameConfig.GAME_WIDTH,
    height: GameConfig.GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: GameConfig.COLORS.BACKGROUND,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [StartScene, GameScene, EndScene]
};

console.log('Creating game with config:', config);
const game = new Phaser.Game(config);
console.log('Game created:', game);
