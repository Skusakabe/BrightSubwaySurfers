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
        this.alive = true;

        //For making the collision box where the player would die if the box collides with a block object
        this.blockHurtboxXMin = 5;
        this.blockHurtboxXMax = 35
        this.blockHurtboxYMin = 0;
        this.blockHurtboxYMax = 32;

        //For making the collision box where the player lands on top of a block or the ground
        this.blockHitboxXMin = 0;
        this.blockHitboxXMax = 40;
        this.blockHitboxYMin = 32;
        this.blockHitboxYMax = 40;

        //For making the collision box where the player dies when they touch a spike object
        this.spikeHurtboxXMin = 5;
        this.spikeHurtboxXMax = 35;
        this.spikeHurtboxYMin = 0;
        this.spikeHurtboxYMax = 40;

        this.onFloor = true;
        this.jumping = false
    }

    position() {
        return [this.x, this.y];
    }

    jump() {
        this.onFloor = false;
        this.jumping = true;
        this.yvel = 8;
        setTimeout(() => {
            console.log('hm');
            this.jumping = false;
        }, 100);
        return;
    }

    collisionDetection() {
        var block;
        var checkLanding = true;
        for (var i = 0; i < obstacles.length; i++) {
            block = obstacles[i];
            if (block.type == "Solid" || block.type == "Ground") {
                // Check if colliding into a wall horizontally
                if (checkIntersecting(this.x + this.blockHurtboxXMin, this.x + this.blockHurtboxXMax, this.y + this.blockHurtboxYMin, this.y + this.blockHurtboxYMax, block.x, block.x + block.width, block.y, block.y + block.height)) {
                    this.alive = false;
                }
                // Check if landing on top of a block, stops checking for this if it find that you are on top of at least 1 solid block
                if (checkLanding) {
                    if (checkIntersecting(this.x + this.blockHitboxXMin, this.x + this.blockHitboxXMax, this.y + this.blockHitboxYMin, this.y + this.blockHitboxYMax, block.x, block.x + block.width, block.y, block.y + block.height)) {
                        if (!this.jumping) {
                            console.log("intersecting with" + block.type);
                            this.onFloor = true;
                            this.y = block.y - 40;
                            this.yvel = 0;
                        }
                        checkLanding = false;
                    }
                    else {
                        this.onFloor = false;
                    }
                }
            }
            else if (block.type == "Spike") {
                // Check if colliding with a spike block (kills if touching from anywhere)
                if (checkIntersecting(this.x + this.spikeHurtboxXMin, this.x + this.spikeHurtboxXMax, this.y + this.spikeHurtboxYMin, this.y + this.spikeHurtboxYMax, block.x, block.x + block.width, block.y, block.y + block.height)) {
                    this.alive = false;
                }
            }
        }
        return;
    }

    physics() {
        if (!this.alive) {
            console.log("ded");
            process.exit(0);
        }
        if (!this.onFloor) {
            this.prevy = this.y;
            this.y -= this.yvel;
            this.yvel -= 0.16;
        }
        return this.position();
    }
}

class Block {
    constructor(x, y, width, height, type) {
        this.width = width;
        this.height = height;
        this.type = type;
        this.x = x;
        this.y = y;
    }

    physics() {
        this.x -= 4;
        return;
    }
}

var checkIntersecting = (aXMin, aXMax, aYMin, aYMax, bXMin, bXMax, bYMin, bYMax) => {
    var xIntersection = false;
    var yIntersection = false;
    if ((aXMin > bXMin && aXMin < bXMax) || (aXMax > bXMin && aXMax < bXMax)) {
        xIntersection = true;
        console.log("xintersection");
        console.log(aXMin + " " + aXMax + " " + bXMin + " " + bXMax);
    }
    if ((aYMin > bYMin && aYMin < bYMax) || (aYMax > bYMin && aYMax < bYMax)) {
        yIntersection = true;
        console.log("yintersection");
        console.log(aYMin + " " + aYMax + " " + bYMin + " " + bYMax);
    }
    if (xIntersection && yIntersection) {
        console.log("We intersectin!");
    }
    return (xIntersection && yIntersection);
}

var clear = (e) => {
    ctx.clearRect(0, 0,c.width,c.height);
};

var startGame = (e) => {
    clear(e);
    obstacles.push(new Block(0, 440, 1200, 60, 'Ground'));
    obstacles.push(new Block(1100, 360, 40, 80, 'Solid'));
    player = new Player();

    runGame(e);
}

var runGame = (e) => {
    window.cancelAnimationFrame(requestID);
    clear(e);
    player.physics();
    player.collisionDetection();
    ctx.fillStyle = "green";
    ctx.fillRect(player.x,player.y,40,40);
    for (var i = 0; i < obstacles.length; i++) {
        if (!(obstacles[i].type == 'Ground')) {
            obstacles[i].physics();
        }
        if (obstacles[i].type == 'Ground' || obstacles[i].type == 'Solid') {
            ctx.fillStyle = "black";
        }
        if (obstacles[i].type == 'Spike') {
            ctx.fillStyle = "red";
        }
        ctx.fillRect(obstacles[i].x,obstacles[i].y,obstacles[i].width,obstacles[i].height);
    }
    blockSpawnRNG = Math.floor(Math.random() * 200);
    if (blockSpawnRNG == 199) {
        obstacles.push(new Block(1100, 360, 40, 80, 'Solid'));
    }
    requestID = window.requestAnimationFrame(runGame);
}

//Later change this to store player inputs from multiple clients, which will then execute the code for each corresponding player
document.addEventListener("keydown", (e) => {
    if (e.key == ' ') {
        player.jump();
        console.log("jumpy time");
    }
});

startButton.addEventListener("click", startGame);