# Cinematic Bouncing Balls Animation Game

A visually stunning interactive animation of 1000 balls bouncing within a square container, with cinematic lighting, physics effects, and game-like interactive elements.

## Features

- 1000 colorful balls with realistic physics
- Cinematic lighting effects with dynamic shadows
- Elastic collisions between balls
- Optimized collision detection using spatial partitioning
- Responsive design that adapts to window size
- Interactive game elements:
  - Draw custom walls for balls to bounce off
  - Create explosive chain reactions
  - Toggle gravity effects
  - Control ball speed and size
  - Freeze/unfreeze the simulation
  - Score tracking system

## Requirements

- Node.js (v12 or higher)
- npm (comes with Node.js)

## Installation

1. Clone this repository or download the files
2. Navigate to the project directory in your terminal
3. Install dependencies:

```bash
npm install
```

## Running the Application

1. Start the server:

```bash
npm start
```

2. Open your browser and go to:

```
http://localhost:3000
```

## How to Play

- **Add Wall**: Click this button and then draw walls on the canvas by clicking and dragging. Balls will bounce off these walls.
- **Erase Wall**: Click this button to enable wall erasing mode, then move your cursor over walls to remove them.
- **Clear All Walls**: Removes all walls from the canvas.
- **Explosion!**: Creates an explosive force that pushes all balls outward and triggers a chain reaction of glowing balls.
- **Toggle Gravity**: Adds or removes gravity from the simulation.
- **Freeze/Unfreeze**: Pauses or resumes the animation.
- **Speed Slider**: Adjust the speed of all balls.
- **Size Slider**: Adjust the size of all balls.

## Scoring

- +1 point when a ball bounces off the container walls
- +2 points when balls collide with each other
- +5 points when a ball bounces off a user-created wall

## How It Works

The animation uses HTML5 Canvas for rendering and JavaScript for the physics simulation. The server is built with Express.js to serve the static files.

- Each ball has its own physics properties (velocity, mass)
- Collision detection is optimized using a grid-based spatial partitioning system
- User-drawn walls use line-segment to circle collision detection
- Cinematic effects include:
  - Dynamic lighting and shadows
  - Motion blur
  - Gradient-based 3D effect on balls
  - Highlights for a glossy appearance
  - Explosion chain reactions

## Performance Notes

The animation is optimized to run smoothly with 1000 balls, but performance may vary depending on your hardware. If you experience lag, try reducing the `ballCount` value in the `public/js/animation.js` file. 