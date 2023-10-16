// create canvas
let canvasHeight = 400;
let canvasWidth = 600;


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

let fallSpeed = 0;
let interval = setInterval(updateCanvas, 20);

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
        var ground = canvasHeight - this.height;

        if (this.y > ground) {
            this.y = ground;
            this.alive = false;
            alert("dead");
        }
    }

    this.makeFall = function() {
        this.y += fallSpeed;
        fallSpeed += 0.2;

        this.checkIfDead();
    }
}

function updateCanvas() {
    ctx = gameCanvas.context;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (player.alive) {
        player.makeFall();
        player.draw();
    }
}

// start game
function startGame() {
    gameCanvas.start();

    player = new createPlayer(30, 30, 10);
}