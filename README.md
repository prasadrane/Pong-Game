# Pong Game

A classic two-player Pong game built with HTML5 Canvas and JavaScript. Experience the nostalgia of one of the first video games in your browser!

## 🎮 Play the Game

**[Play Pong Game Now!](https://prasadrane.github.io/Pong-Game/)**

## 🎯 Game Features

- **Two-Player Gameplay**: Compete against a friend in classic Pong action
- **Real-time Score Tracking**: Keep track of points for both players
- **Smooth Animation**: Fluid paddle and ball movement using HTML5 Canvas
- **Responsive Controls**: Intuitive keyboard controls for both players
- **Pause/Resume**: Press spacebar to pause and resume the game anytime

## 🕹️ How to Play

### Game Rules
- The objective is to score points by getting the ball past your opponent's paddle
- First player to reach the target score wins
- The ball bounces off the top and bottom walls, and off the paddles
- If the ball passes a paddle, the opposing player scores a point

### Controls
- **Player 1 (Left Paddle)**:
  - `W` - Move paddle up
  - `S` - Move paddle down

- **Player 2 (Right Paddle)**:
  - `↑` (Up Arrow) - Move paddle up
  - `↓` (Down Arrow) - Move paddle down

- **Game Control**:
  - `SPACEBAR` - Start game / Pause / Resume

## 🚀 Technologies Used

- **HTML5** - Game structure and canvas element
- **CSS3** - Styling and responsive design
- **JavaScript** - Game logic, animation, and user interaction
- **GitHub Pages** - Hosting and deployment

## 🛠️ Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/prasadrane/Pong-Game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Pong-Game
   ```

3. Open `index.html` in your web browser or serve it with a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

4. Open your browser and go to `http://localhost:8000` (or directly open the `index.html` file)

## 📦 Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Any push to the `main` branch triggers the deployment workflow, making the game available at https://prasadrane.github.io/Pong-Game/

## 🎨 Game Preview

The game features a clean, minimalist design with:
- Centered game canvas (800x400 pixels)
- Score display for both players
- Control instructions
- Game status messages
- Classic white paddles and ball on a dark background

---

Enjoy playing this classic Pong game! Feel free to contribute or suggest improvements.