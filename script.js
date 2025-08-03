// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const player1Score = document.getElementById('player1Score');
const player2Score = document.getElementById('player2Score');
const gameStatus = document.getElementById('gameStatus');
const winnerModal = document.getElementById('winnerModal');
const winnerText = document.getElementById('winnerText');
const playAgainBtn = document.getElementById('playAgainBtn');

// Game settings
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 15;
const PADDLE_SPEED = 5;
const BALL_SPEED = 4;

// Game state
let gameRunning = false;
let gameOver = false;

// Game objects
const game = {
    score: {
        player1: 0,
        player2: 0
    }
};

const paddle1 = {
    x: 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

const paddle2 = {
    x: canvas.width - PADDLE_WIDTH - 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: BALL_SIZE,
    dx: BALL_SPEED,
    dy: BALL_SPEED
};

// Input handling
const keys = {};

// Touch controls variables
let touchStartY = null;
let touchPaddle = null;

// Touch sensitivity settings for better mobile experience
const TOUCH_SENSITIVITY = {
    EXPAND_ZONE: 50, // Pixels to expand touch zones beyond canvas
    MIN_TOUCH_HEIGHT: 100, // Minimum touch area height around paddle
    OVERLAP_ZONE: 100 // Pixels of overlap in center for easier switching
};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    
    // Prevent default behavior for arrow keys and space
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
    }
    
    if (e.key === ' ') {
        if (!gameRunning && !gameOver) {
            startGame();
        } else if (gameRunning) {
            pauseGame();
        } else if (gameOver) {
            resetGame();
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Touch event handlers
canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

// Add expanded touch zones to document for better mobile experience
document.addEventListener('touchstart', handleDocumentTouchStart, { passive: false });
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd, { passive: false });

function handleDocumentTouchStart(e) {
    // Only handle touches when game is running and not already handled by canvas
    if (!gameRunning) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    
    // Check if touch is near the canvas area (expanded zones)
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    const expandedLeft = rect.left - TOUCH_SENSITIVITY.EXPAND_ZONE;
    const expandedRight = rect.right + TOUCH_SENSITIVITY.EXPAND_ZONE;
    const expandedTop = rect.top - TOUCH_SENSITIVITY.EXPAND_ZONE;
    const expandedBottom = rect.bottom + TOUCH_SENSITIVITY.EXPAND_ZONE;
    
    // Only handle touches in expanded game area
    if (touchX >= expandedLeft && touchX <= expandedRight && 
        touchY >= expandedTop && touchY <= expandedBottom) {
        
        // Convert to canvas coordinates
        const canvasX = Math.max(0, Math.min(canvas.width, 
            (touchX - rect.left) * (canvas.width / rect.width)));
        const canvasY = Math.max(0, Math.min(canvas.height, 
            (touchY - rect.top) * (canvas.height / rect.height)));
        
        // Create synthetic event for handleTouchStart
        const syntheticEvent = {
            preventDefault: () => e.preventDefault(),
            touches: [{
                clientX: rect.left + (canvasX * rect.width / canvas.width),
                clientY: rect.top + (canvasY * rect.height / canvas.height)
            }]
        };
        
        handleTouchStart(syntheticEvent);
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const touchY = (touch.clientY - rect.top) * (canvas.height / rect.height);
    
    // Expanded touch zones for better mobile experience
    const leftZoneEnd = (canvas.width / 2) + TOUCH_SENSITIVITY.OVERLAP_ZONE;
    const rightZoneStart = (canvas.width / 2) - TOUCH_SENSITIVITY.OVERLAP_ZONE;
    
    // Determine which paddle area was touched with expanded zones
    if (touchX < leftZoneEnd) {
        // Left side or center-left - Player 1 paddle
        touchPaddle = 'player1';
    } else if (touchX > rightZoneStart) {
        // Right side or center-right - Player 2 paddle  
        touchPaddle = 'player2';
    } else {
        // Fallback: choose closest paddle based on current position
        const distToLeftPaddle = Math.abs(touchY - (paddle1.y + PADDLE_HEIGHT / 2));
        const distToRightPaddle = Math.abs(touchY - (paddle2.y + PADDLE_HEIGHT / 2));
        touchPaddle = distToLeftPaddle < distToRightPaddle ? 'player1' : 'player2';
    }
    
    touchStartY = touchY;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (touchStartY === null || touchPaddle === null) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchY = (touch.clientY - rect.top) * (canvas.height / rect.height);
    
    // Enhanced paddle position calculation with improved sensitivity
    const targetY = touchY - PADDLE_HEIGHT / 2;
    const clampedY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, targetY));
    
    // Smooth paddle movement for better touch experience
    if (touchPaddle === 'player1') {
        paddle1.y = clampedY;
    } else if (touchPaddle === 'player2') {
        paddle2.y = clampedY;
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    touchStartY = null;
    touchPaddle = null;
}

// Play Again button handler
playAgainBtn.addEventListener('click', () => {
    hideWinnerModal();
    resetGame();
});

// Game functions
function startGame() {
    gameRunning = true;
    gameOver = false;
    gameStatus.textContent = 'Game in progress...';
    gameLoop();
}

function pauseGame() {
    gameRunning = false;
    gameStatus.textContent = 'Game paused. Press SPACE to continue.';
}

function resetGame() {
    gameRunning = false;
    gameOver = false;
    game.score.player1 = 0;
    game.score.player2 = 0;
    updateScore();
    
    // Reset positions
    paddle1.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    paddle2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    resetBall();
    
    gameStatus.textContent = 'Press SPACE to start the game!';
    draw();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // Randomize initial direction
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED;
}

function updatePaddles() {
    // Player 1 controls (W/S)
    if (keys['w'] && paddle1.y > 0) {
        paddle1.y -= PADDLE_SPEED;
    }
    if (keys['s'] && paddle1.y < canvas.height - PADDLE_HEIGHT) {
        paddle1.y += PADDLE_SPEED;
    }
    
    // Player 2 controls (Arrow keys)
    if (keys['arrowup'] && paddle2.y > 0) {
        paddle2.y -= PADDLE_SPEED;
    }
    if (keys['arrowdown'] && paddle2.y < canvas.height - PADDLE_HEIGHT) {
        paddle2.y += PADDLE_SPEED;
    }
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y >= canvas.height - ball.size) {
        ball.dy = -ball.dy;
    }
    
    // Ball collision with paddles
    if (ball.x <= paddle1.x + paddle1.width &&
        ball.y >= paddle1.y &&
        ball.y <= paddle1.y + paddle1.height &&
        ball.dx < 0) {
        ball.dx = -ball.dx;
        // Add some variation to the bounce angle
        ball.dy += (Math.random() - 0.5) * 2;
    }
    
    if (ball.x + ball.size >= paddle2.x &&
        ball.y >= paddle2.y &&
        ball.y <= paddle2.y + paddle2.height &&
        ball.dx > 0) {
        ball.dx = -ball.dx;
        // Add some variation to the bounce angle
        ball.dy += (Math.random() - 0.5) * 2;
    }
    
    // Scoring
    if (ball.x < 0) {
        game.score.player2++;
        updateScore();
        resetBall();
        checkWin();
    } else if (ball.x > canvas.width) {
        game.score.player1++;
        updateScore();
        resetBall();
        checkWin();
    }
}

function checkWin() {
    const maxScore = 5;
    if (game.score.player1 >= maxScore) {
        gameOver = true;
        gameRunning = false;
        showWinnerModal('Player 1 Wins!');
    } else if (game.score.player2 >= maxScore) {
        gameOver = true;
        gameRunning = false;
        showWinnerModal('Player 2 Wins!');
    }
}

function showWinnerModal(winner) {
    winnerText.textContent = winner;
    winnerModal.style.display = 'block';
    gameStatus.textContent = 'Game Over!';
}

function hideWinnerModal() {
    winnerModal.style.display = 'none';
}

function updateScore() {
    player1Score.textContent = game.score.player1;
    player2Score.textContent = game.score.player2;
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw touch zone indicators (subtle visual feedback)
    if (touchPaddle || !gameRunning) {
        drawTouchZoneIndicators();
    }
    
    // Draw center line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    
    // Draw ball
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function drawTouchZoneIndicators() {
    // Draw subtle touch zone indicators for better mobile UX
    ctx.globalAlpha = 0.1;
    
    // Left touch zone (Player 1)
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, 0, (canvas.width / 2) + TOUCH_SENSITIVITY.OVERLAP_ZONE, canvas.height);
    
    // Right touch zone (Player 2)  
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect((canvas.width / 2) - TOUCH_SENSITIVITY.OVERLAP_ZONE, 0, 
                 (canvas.width / 2) + TOUCH_SENSITIVITY.OVERLAP_ZONE, canvas.height);
    
    ctx.globalAlpha = 1.0;
}

function gameLoop() {
    if (!gameRunning) return;
    
    updatePaddles();
    updateBall();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Initialize game
function init() {
    updateScore();
    draw();
}

// Start the game
init();