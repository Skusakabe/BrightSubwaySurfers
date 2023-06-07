var obstacles = [];
var c = document.getElementById("playground");
var ctx = c.getContext("2d");
var startButton = document.getElementById("buttonStart");
var requestID;
var player

class Player {
    constructor() {
        this.x = 40;
        this.y = 400;
        this.yvel = 0;

        //For making the collision box where the player would die if the box collides with a block object
        this.blockHurtboxXMin = 5;
        this.blockHurtboxXMax = 35
        this.blockHurtboxYMin = 8;
        this.blockHurtboxYMax = 40;

        //For making the collision box where the player lands on top of a block or the ground
        this.blockHitboxXMin = 0;
        this.blockHitboxXMax = 40;
        this.blockHitboxYMin = 0;
        this.blockHitboxYMax = 8;

        //For making the collision box where the player dies when they touch a spike object
        this.spikeHurtboxXMin = 5;
        this.spikeHurtboxXMax = 35;
        this.spikeHurtboxYMin = 0;
        this.spikeHurtboxYMax = 40;

        this.isJumping = false;
        this.isFalling = false;
        this.onFloor = true;
    }

    position() {
        return [this.x, this.y];
    }

    jump() {
        this.onFloor = false;
        this.yvel = 5;
        return
    }

    collisionDetection(block) {
        return
    }

    physics() {
        if (!(this.onFloor)) {
            this.y -= yvel;
            this.yvel += 0.1;
        }
        return this.position()
    }
}

class Block {
    constuctor(width, height, type) {
        this.width = width;
        this.height = height;
        this.type = type;
        this.x = 1100;
        this.y = 400;
    }

    physics() {
        this.x -= 4;
    }
}

var clear = (e) => {
    ctx.clearRect(0, 0,c.width,c.height);
};

var broadcastGameState = () => {
    var gameState = [players, obstacles];
    io.emit('gameState', gameState);
}

var startGame = (e) => {
    clear(e);
    obstacles.push(new Block(40,80,'Solid'));
    player = new Player();

    runGame(e);
}

var runGame = (e) => {
    window.cancelAnimationFrame(requestID);
    clear(e);
    player.physics();
    ctx.fillRect(player.x,player.y,40,40);
    for (var i = 0; i > obstacles.length; i++) {
        obstacles[i].physics();
        ctx.fillRect(obstacles[i].x,obstacles[i].y,obstacles[i].width,obstacles[i].height);
    }
    requestID = window.requestAnimationFrame(runGame);
}

//Later change this to store player inputs from multiple clients, which will then execute the code for each corresponding player
document.onkeydown = (e) => {
    if (e.key == 'Space') {
        player.jump();var dotButton = document.getElementById("buttonCircle");
    }
}

startButton.addEventListener("click", startGame);