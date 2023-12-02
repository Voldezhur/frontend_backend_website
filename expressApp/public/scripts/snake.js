// --- game settings ---

let tickSpeed = 200;

let playerStartingX = 270;
let playerStartingY = 150;

let startingSegments = 4;

let doAlert = true;

// ---------------------


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


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
let fluit;
let segments = [];

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

    // if (code == 'KeyC') {
    //     segments.push(new createSegment(segments.slice(-1).x, segments.slice(-1).y));
    // }
}, false);

// instantiate head
function createPlayer() {
    this.width = 30;
    this.height = 30;
    this.x = playerStartingX;
    this.y = playerStartingY;
    this.alive = true;
    this.xDirection = 1;
    this.yDirection = 0;

    this.moveQueue = [];

    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "#016308";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.checkIfDead = function() {
        if (this.alive == false) {
            if (doAlert) {
                alert("Вы проирали!\nФинальные очки: " + score + "\nФинальная длина: " + (segments.length + 1));
                doAlert = false;
            }
            
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
        
        let newX = this.x + speed * this.xDirection;
        let newY = this.y + speed * this.yDirection;
        
        // Флаг на движение - при провале проверок станет false
        let moveFlag = true;
        
        // проверка, столкнется ли игрок со стеной при движении
        if (newX >= canvasWidth || newX < 0 || newY >= canvasHeight || newY < 0) {
            this.alive = false;
            moveFlag = false
        }

        // проверка, столкнется ли игрок со своим хвостом при движении
        for (let i = 0; i < segments.length; i++) {
            if (newX == segments[i].x && newY == segments[i].y) {
                this.alive = false;
                moveFlag = false;
                break;
            }
        }

        // Съедение фрукта
        if (newX == fruit.x && newY == fruit.y) {
            fruit.moveFruit();
            segments.push(new createSegment(segments.slice(-1).x, segments.slice(-1).y));
            score++;
        }

        // Движение головы и сегментов
        if (moveFlag) {
            let oldX = this.x;
            let oldY = this.y;

            this.x = newX;
            this.y = newY;

            // Движение предыдущего сегмента
            segments[0].moveSegment(oldX, oldY);
        }
    }
}

// instantiate snake segments
function createSegment(startingX, startingY) {
    this.width = 30;
    this.height = 30;
    this.x = startingX;
    this.y = startingY;
    
    this.nextIndex = Object.keys(segments).length + 1;
    
    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "#016308";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.moveSegment = function(newX, newY) {
        let oldX = this.x;
        let oldY = this.y;
        
        this.x = newX;
        this.y = newY;

        if (segments.length > this.nextIndex) {
            segments[this.nextIndex].moveSegment(oldX, oldY);
        }
    }
}

function createFruit() {
    this.width = 30;
    this.height = 30;

    this.x = -1;
    this.y = -1;

    this.draw = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = "#f7052d";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.moveFruit = function() {
        xCandidate = getRandomInt(0, canvasWidth - 30);
        yCandidate = getRandomInt(0, canvasHeight - 30);

        while(xCandidate % 30 != 0 || yCandidate % 30 != 0) {
            xCandidate = getRandomInt(0, canvasWidth - 30);
            yCandidate = getRandomInt(0, canvasHeight - 30);
        }

        this.x = xCandidate;
        this.y = yCandidate;
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
    // player.checkCollisions();
    player.checkIfDead();

    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (player.alive) {  // only draw the player, if they are alive;
        player.movePlayer();
        player.draw();
        
        for (let i = 0; i < segments.length; i++) {
            segments[i].draw();
        }
    }

    fruit.draw();
    scoreLabel.draw();
}

// start game
function startGame() {
    gameCanvas.start();
    player = new createPlayer();
    
    segments.push(new createSegment(playerStartingX - 30, playerStartingY));
    segments.push(new createSegment(playerStartingX - 30, playerStartingY));
    segments.push(new createSegment(playerStartingX - 30, playerStartingY));
    segments.push(new createSegment(playerStartingX - 30, playerStartingY));

    fruit = new createFruit();
    fruit.moveFruit();

    scoreLabel = new createScoreLabel();
}