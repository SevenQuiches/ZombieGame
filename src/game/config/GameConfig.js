const GameConfig = {
    GAME_WIDTH: 1024,
    GAME_HEIGHT: 768,
    
    PLAYER: {
        SPEED: 200,
        MAX_HEALTH: 100,
        MAX_AMMO: 30,
        RELOAD_TIME: 2000,
        FIRE_RATE: 150,
        BULLET_SPEED: 600,
        BULLET_DAMAGE: 25
    },
    
    ZOMBIE: {
        NORMAL: {
            SPEED: 60,
            HEALTH: 50,
            DAMAGE: 10,
            SCORE: 10,
            COLOR: 0x4a7c4e,
            SIZE: 20
        },
        FAST: {
            SPEED: 120,
            HEALTH: 30,
            DAMAGE: 8,
            SCORE: 15,
            COLOR: 0x7c4a4a,
            SIZE: 16
        },
        GIANT: {
            SPEED: 40,
            HEALTH: 200,
            DAMAGE: 25,
            SCORE: 50,
            COLOR: 0x4a4a7c,
            SIZE: 35
        }
    },
    
    WAVE: {
        MAX_WAVES: 5,
        BASE_ZOMBIE_COUNT: 5,
        ZOMBIE_INCREMENT: 3,
        PREPARATION_TIME: 5000,
        SPAWN_INTERVAL: 1500
    },
    
    COLORS: {
        BACKGROUND: 0x2d3436,
        PLAYER: 0x3498db,
        BULLET: 0xf1c40f,
        UI_TEXT: '#ffffff',
        UI_HEALTH: '#e74c3c',
        UI_AMMO: '#f39c12',
        UI_WAVE: '#9b59b6'
    }
};
