// create canvas
let canvasHeight = 400;
let canvasWidth = 600;

let score = 0;
let scored = false;  // to only add 1 score after passing through a gap
let gameRunning = false;

let gameCanvas = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        document.getElementById("mainSection").appendChild(this.canvas);
    }
}

// create player
let player;
let playerYPosition = 200;

let velocity = 0;
let interval = setInterval(updateCanvas, 20);

let isJumping = false;
let jumpHeight = 1;

// create event listener for keyboard input
document.addEventListener('keydown', (event) => {
    let code = event.code;

    if (code == "Space") {
        if (gameRunning == false) {
            gameRunning = true;
            startGame();
        }
        
        else {
            velocity = 5;
        }
    }
}, false);

// instantiate player
function createPlayer(width, height, x) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = playerYPosition;
    this.alive = true;

    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "orange";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.checkIfDead = function() {
        if (this.alive == false) {
            gameCanvas.stop();
            gameRunning = false;
        }
    }

    this.movePlayer = function() {
        this.y -= velocity;
        velocity -= 0.2;

        var ground = canvasHeight - this.height;

        if (this.y > ground) {
            this.alive = false;
        }
    }
}

// create attack pipe
let pipe;

let pipeSpeed = 6;

function createPipe() {
    this.x = canvasWidth;
    this.speed = pipeSpeed;

    this.gap = 60;  // size of the gap
    this.width = 40;

    let minGapHeight = 300;
    let maxGapHeight = 100;

    this.gapPosition = Math.floor(Math.random() * (minGapHeight - maxGapHeight) + maxGapHeight);  // y position of the gap

    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "lightgreen";

        ctx.fillRect(this.x, this.gapPosition + this.gap, this.width, canvasHeight);
        ctx.fillRect(this.x, 0, this.width, this.gapPosition - this.gap);
    }

    // return to the start and generate the gap randomly
    this.returnToStart = function() {
        if (this.x < 0 - this.width) {
            this.gapPosition = Math.floor(Math.random() * (minGapHeight - maxGapHeight) + maxGapHeight);  // y position of the gap
            this.x = canvasWidth;

            scored = false;
        }
    }

    // just.. move left
    this.move = function() {
        this.x -= this.speed;
        this.returnToStart();
    }
}

function detectCollision() {
    let playerBottom = player.y + player.height;
    let playerTop = player.y;
    let playerLeft = player.x;
    let playerRight = player.x + player.width;

    let pipeLeft = pipe.x;
    let pipeRight = pipe.x + pipe.width;
    let topPipeHeight = pipe.gapPosition - pipe.gap;
    let bottomPipeHeight = pipe.gapPosition + pipe.gap;

    // Check if top pipe is colliding
    if (playerRight > pipeLeft && 
        playerLeft < pipeRight && 
        playerTop < topPipeHeight) {
            player.alive = false;
        }

    // Check if bottom pipe is colliding
    else if (playerRight > pipeLeft && 
        playerLeft < pipeRight && 
        playerBottom > bottomPipeHeight) {
            player.alive = false;
        }

    // check if player got through the gap
    else if (playerLeft > pipeRight && scored == false) {
        score += 1;
        scored = true;
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
    detectCollision();
    player.checkIfDead();

    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (player.alive) {  // only draw the player, if they are alive;
        player.movePlayer();
        player.draw();
    }
        
    pipe.draw(); 
    pipe.move();

    scoreLabel.draw();
}

// start game
function startGame() {
    gameCanvas.start();
    player = new createPlayer(30, 30, 10);
    pipe = new createPipe();

    scoreLabel = new createScoreLabel();
}