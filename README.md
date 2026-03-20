# 🧟‍♂️ Zombie Survival Game

A top-down zombie survival shooting game built with Phaser.js, React, and TypeScript.

## 🎮 Game Features

- **Player Controls**: WASD movement, mouse aiming and shooting
- **Zombie Types**:
  - Normal Zombie: Balanced speed and health
  - Fast Zombie: High speed, low health
  - Giant Zombie: Low speed, high health and damage
- **Wave System**: 5 waves of increasing difficulty
- **Game Mechanics**: Health system, ammo management with reloading
- **Multiple Scenes**: Start screen, gameplay, victory/defeat screens

## 🛠️ Tech Stack

- **Game Engine**: Phaser.js 3.80
- **UI Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8.0
- **Physics**: Arcade Physics

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 How to Play

1. Use **WASD** keys to move your character
2. **Mouse** to aim
3. **Left click** to shoot
4. **R** to reload
5. Survive all 5 waves to win!

## 📁 Project Structure

```
src/
├── game/
│   ├── GameConfig.ts          # Game constants and configuration
│   ├── GameComponent.tsx      # React wrapper for Phaser game
│   └── scenes/
│       ├── StartScene.ts      # Start menu
│       ├── GameScene.ts       # Main gameplay
│       ├── GameOverScene.ts   # Defeat screen
│       └── VictoryScene.ts    # Victory screen
├── App.tsx
├── main.tsx
└── index.css
```

## ✨ Recent Updates

- Fixed collision detection system
- Resolved health bar display issues
- Improved wave completion logic
- Added hit cooldown protection
