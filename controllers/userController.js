// For managing game logic (game events and user inputs)
var express = require('express');
var http = require('http');
var socketIO = require('socket.io');

var app = express()
var server = http.createServer();
var io = socketIO(server);

const port = 3000
const createCanvas = require('canvas');

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('pages/index')
})
app.listen(port, () => {
    console.log(`App listening at port ${port}`)
})

var players = [];
var obstacles = [];

var clear = (e) => {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
};

class Player {
    constructor() {
        this.x = 20;
        this.y = 200;
        this.yvel = 0;

        //For making the collision box where the player would die if the box collides with a block object
        this.blockHurtboxXMin = 5;
        this.blockHurtboxXMax = 35
        this.blockHurtboxYMin = 8;
        this.blockHurtboxYMax = 40

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

    jump() {
        this.onFloor = false;
        this.yvel = 5;
    }

    collisionDetection(block) {
        
    }

    physics() {
        if (!(this.onFloor)) {
            this.y -= yvel;
            this.yvel += 0.1;
        }
    }
}

class Block {
    constuctor(width, height, type) {
        this.width = width;
        this.height = height;
        this.type = type;
        this.x = 550;
        this.y = 200;
    }

    physics() {
        this.x -= 4;
    }
}

/*
var makeSolidBlock = (width, height, x, y) => {

}

// Probably make spike blocks just squares with a different color, writing code for collision detection with a triangle shape is extra work and probably not worth it unless I have time
var makeSpikeBlock = (width, height, x, y) => {

}
*/

var broadcastGameState = () => {
    var gameState = [players, obstacles];
    io.emit('gameState', gameState);
}

var startGame = (e) => {
    clear(e);
    obstacles.push(new Block(40,80,'Solid'));
    players.push(new Player());

    runGame(e);
}

/*
var collisionDetection = (player, block) => {

}
*/

var runGame = (e) => {
    for (var i = 0; i < players.length; i++) {
        players[i].physics();
    }
    for (var i = 0; i > obstacles.length; i++) {
        obstacles[i].physics();
    }
}

io.on('connection', (socket) => {
    // Send the initial game state to the newly connected client
    socket.emit('gameState', gameState);

    // Handle client disconnection
    socket.on('disconnect', () => {
        // Remove the player associated with the disconnected client from the game state
        // You would need to implement this part based on your game's logic
        // For example: gameState.players = gameState.players.filter(player => player.id !== socket.id);

        // Broadcast the updated game state to all remaining clients
        broadcastGameState();
    })
})

//Later change this to store player inputs from multiple clients, which will then execute the code for each corresponding player
document.onkeydown = (e) => {
    if (e.key == 'Space') {
        player.jump();
    }
}

startGame();
setInterval(runGame, 1000 / 60);