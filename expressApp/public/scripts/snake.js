// put game settings here
let tickSpeed = 400;


// create canvas
let canvasHeight = 420;
let canvasWidth = 600;

let score = 0;
let scored = false;  // to only add 1 score after passing through a gap
let gameRunning = false;

let gameCanvas = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.canvas.style.backgroundColor = "#38ba41";
        this.context = this.canvas.getContext("2d");
        document.getElementById("mainSection").appendChild(this.canvas);
    }
}

// create player
let player;

let speed = 30;
let interval = setInterval(updateCanvas, tickSpeed);

let gameBeginText = document.createElement('h1');
gameBeginText.classList.add('sectionTitle');
gameBeginText.textContent = "Для начала игры нажмите пробел";
document.getElementById("mainSection").appendChild(gameBeginText);

// create event listener for keyboard input
document.addEventListener('keydown', (event) => {
    let code = event.code;

    if (code == "Space") {
        if (gameRunning == false) {
            gameRunning = true;
            gameBeginText.remove();
            startGame();
        }
    }

    // Добавление движения в очередь
    if (code == 'ArrowLeft') {
        if (player.moveQueue.slice(-1) && player.moveQueue.slice(-1)[1] != 0) {
            player.moveQueue.push([-1, 0]);
        }

        else if (player.xDirection == 0){
            player.moveQueue.push([-1, 0]);
        }
    }

    if (code == 'ArrowRight') {
        if (player.moveQueue.slice(-1) && player.moveQueue.slice(-1)[1] != 0) {
            player.moveQueue.push([1, 0]);
        }

        else if (player.xDirection == 0){
            player.moveQueue.push([1, 0]);
        }
    }

    if (code == 'ArrowUp') {
        if (player.moveQueue.slice(-1) && player.moveQueue.slice(-1)[0] != 0) {
            player.moveQueue.push([0, -1]);
        }

        else if (player.yDirection == 0){
            player.moveQueue.push([0, -1]);
        }
    }

    if (code == 'ArrowDown') {
        if (player.moveQueue.slice(-1) && player.moveQueue.slice(-1)[0] != 0) {
            player.moveQueue.push([0, 1]);
        }

        else if (player.yDirection == 0){
            player.moveQueue.push([0, 1]);
        }
    }

}, false);

// instantiate player
function createPlayer(width, height) {
    this.width = width;
    this.height = height;
    this.x = 270;
    this.y = 150;
    this.alive = true;
    this.xDirection = 1;
    this.yDirection = 0;

    this.moveQueue = [];

    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "#016308";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.checkCollisions = function() {
        if (this.x >= canvasWidth || this.x < 0 || this.y >= canvasHeight || this.y < 0) {
            this.alive = false;
        }
    }

    this.checkIfDead = function() {
        if (this.alive == false) {
            gameCanvas.stop();
            gameRunning = false;
        }
    }

    this.movePlayer = function() {
        // Берем следующее движение из очереди
        let nextMove = this.moveQueue[0];
        if (nextMove) {
            if (this.xDirection != nextMove[0] * -1) {
                this.xDirection = nextMove[0];
            }
            if (this.yDirection != nextMove[1] * -1) {
                this.yDirection = nextMove[1];
            }

            this.moveQueue.shift();
        }
        
        this.y += speed * this.yDirection;
        this.x += speed * this.xDirection;
    }
}

// create score label
let scoreLabel;

let createScoreLabel = function() {
    this.margin = 10;
    this.fontSize = 25;

    this.width = 100;
    this.x = canvasWidth - this.width - this.margin - this.fontSize;
    this.y = 0 + this.margin + this.fontSize;

    this.draw = function() {
        this.text = "Очки: " + score;
        ctx = gameCanvas.context;
        
        ctx.font = "25px Ubuntu";
        ctx.fillStyle = "white";
        ctx.fillText(this.text, this.x, this.y);
    }
}

// function update the canvas
function updateCanvas() {    
    player.checkCollisions();
    player.checkIfDead();

    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (player.alive) {  // only draw the player, if they are alive;
        player.movePlayer();
        player.draw();
    }

    scoreLabel.draw();
}

// start game
function startGame() {
    gameCanvas.start();
    player = new createPlayer(30, 30);

    scoreLabel = new createScoreLabel();
}