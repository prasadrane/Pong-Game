// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerScoreElement = document.getElementById('playerScore');
const computerScoreElement = document.getElementById('computerScore');
const restartBtn = document.getElementById('restartBtn');

// Game state
let gameRunning = true;
let keys = {};

// Game objects
const game = {
    width: canvas.width,
    height: canvas.height,
    playerScore: 0,
    computerScore: 0
};

const paddle = {
    width: 15,
    height: 80,
    speed: 6
};

const player = {
    x: 20,
    y: game.height / 2 - paddle.height / 2,
    width: paddle.width,
    height: paddle.height,
    speed: paddle.speed,
    dy: 0
};

const computer = {
    x: game.width - 35,
    y: game.height / 2 - paddle.height / 2,
    width: paddle.width,
    height: paddle.height,
    speed: paddle.speed * 0.8
};

const ball = {
    x: game.width / 2,
    y: game.height / 2,
    radius: 8,
    dx: 5,
    dy: 3,
    speed: 5
};

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

restartBtn.addEventListener('click', resetGame);

// Game functions
function updatePlayer() {
    if (keys['w'] || keys['arrowup']) {
        player.dy = -player.speed;
    } else if (keys['s'] || keys['arrowdown']) {
        player.dy = player.speed;
    } else {
        player.dy = 0;
    }
    
    player.y += player.dy;
    
    // Keep player paddle within bounds
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > game.height) player.y = game.height - player.height;
}

function updateComputer() {
    // Simple AI: follow the ball
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    if (computerCenter < ballCenter - 35) {
        computer.y += computer.speed;
    } else if (computerCenter > ballCenter + 35) {
        computer.y -= computer.speed;
    }
    
    // Keep computer paddle within bounds
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > game.height) computer.y = game.height - computer.height;
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= game.height) {
        ball.dy = -ball.dy;
    }
    
    // Ball collision with player paddle
    if (ball.x - ball.radius <= player.x + player.width &&
        ball.y >= player.y &&
        ball.y <= player.y + player.height &&
        ball.dx < 0) {
        ball.dx = -ball.dx;
        
        // Add some angle based on where ball hits paddle
        const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        ball.dy = hitPos * 4;
    }
    
    // Ball collision with computer paddle
    if (ball.x + ball.radius >= computer.x &&
        ball.y >= computer.y &&
        ball.y <= computer.y + computer.height &&
        ball.dx > 0) {
        ball.dx = -ball.dx;
        
        // Add some angle based on where ball hits paddle
        const hitPos = (ball.y - (computer.y + computer.height / 2)) / (computer.height / 2);
        ball.dy = hitPos * 4;
    }
    
    // Ball goes off left side (computer scores)
    if (ball.x + ball.radius < 0) {
        game.computerScore++;
        computerScoreElement.textContent = game.computerScore;
        resetBall();
    }
    
    // Ball goes off right side (player scores)
    if (ball.x - ball.radius > game.width) {
        game.playerScore++;
        playerScoreElement.textContent = game.playerScore;
        resetBall();
    }
}

function resetBall() {
    ball.x = game.width / 2;
    ball.y = game.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * 4;
}

function resetGame() {
    game.playerScore = 0;
    game.computerScore = 0;
    playerScoreElement.textContent = '0';
    computerScoreElement.textContent = '0';
    
    player.y = game.height / 2 - paddle.height / 2;
    computer.y = game.height / 2 - paddle.height / 2;
    
    resetBall();
    gameRunning = true;
}

function drawRect(x, y, width, height, color = 'white') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color = 'white') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawDottedLine() {
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(game.width / 2, 0);
    ctx.lineTo(game.width / 2, game.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.setLineDash([]);
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, game.width, game.height);
    
    // Draw center line
    drawDottedLine();
    
    // Draw paddles
    drawRect(player.x, player.y, player.width, player.height);
    drawRect(computer.x, computer.y, computer.width, computer.height);
    
    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius);
}

function gameLoop() {
    if (gameRunning) {
        updatePlayer();
        updateComputer();
        updateBall();
    }
    
    render();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();