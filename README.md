# Pong Game 🏓

A simple and intuitive web-based Pong game built with HTML5 Canvas and JavaScript.

## 🎮 How to Play

- Use **W/S** keys or **Arrow Up/Down** keys to move your paddle
- Score points by getting the ball past your opponent's paddle
- Click **Restart Game** to reset the score and start over

## 🚀 Play Online

The game is automatically deployed to GitHub Pages via GitHub Actions. Visit the live game at:
**[Play Pong Game](https://prasadrane.github.io/Pong-Game/)**

## 🛠 Local Development

To run the game locally:

1. Clone this repository
2. Open `index.html` in your web browser, or
3. Serve the files using a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## 📁 Project Structure

- `index.html` - Main game page with canvas element
- `script.js` - Game logic, physics, and controls
- `style.css` - Modern styling and responsive design
- `.github/workflows/deploy.yml` - GitHub Actions workflow for automatic deployment

## ✨ Features

- Smooth 60fps gameplay using `requestAnimationFrame`
- Realistic ball physics with collision detection
- AI opponent that follows the ball
- Responsive design that works on different screen sizes
- Modern UI with gradient backgrounds and animations
- Score tracking and game restart functionality

## 🤖 AI Opponent

The computer paddle uses a simple but effective AI that:
- Follows the ball's Y position
- Has slightly slower speed than the player for balanced gameplay
- Includes a small dead zone to make it beatable

Enjoy playing! 🎉