# Square and 1000 Balls Game

An interactive particle simulation featuring 1000 balls with symmetrical movement patterns and dynamic wall interactions.

## Features

- 1000 particles with symmetrical movement
- Interactive wall drawing and erasing
- Gravity toggle
- Explosion effects
- Speed and size controls
- Modern dark theme UI
- Collision detection and physics
- Real-time score tracking

## Controls

- **Draw Wall**: Click and drag to create walls
- **Erase Wall**: Click to remove walls
- **Clear All**: Remove all walls
- **Explode**: Create an explosion effect
- **Gravity**: Toggle gravity effect
- **Pause**: Freeze the simulation
- **Speed**: Adjust particle velocity
- **Size**: Modify particle size

## Technologies Used

- HTML5 Canvas
- JavaScript (ES6+)
- CSS3 with modern features
- Express.js for serving

## Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser

## Design

- Modern dark theme
- Glass-morphism effects
- SF Pro Display font
- Responsive layout
- Smooth animations and transitions

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