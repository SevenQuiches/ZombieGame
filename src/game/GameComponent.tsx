import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { config } from './GameConfig';
import { StartScene } from './scenes/StartScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { VictoryScene } from './scenes/VictoryScene';

const GameComponent = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    console.log('GameComponent mounted, initializing Phaser...');
    
    if (gameRef.current && !gameInstanceRef.current) {
      try {
        const gameConfig: Phaser.Types.Core.GameConfig = {
          ...config,
          parent: gameRef.current,
          scene: [StartScene, GameScene, GameOverScene, VictoryScene],
          backgroundColor: '#1a1a2e'
        };

        gameInstanceRef.current = new Phaser.Game(gameConfig);
        console.log('Phaser game created successfully');
      } catch (error) {
        console.error('Error creating Phaser game:', error);
      }
    }

    return () => {
      console.log('GameComponent unmounted, destroying Phaser game...');
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#111827'
    }}>
      <div ref={gameRef} style={{
        width: '1200px',
        height: '800px',
        border: '4px solid #374151',
        borderRadius: '8px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }} />
    </div>
  );
};

export default GameComponent;
