var obstacles = [];
var playerTrails = [];
var c = document.getElementById("playground");
var ctx = c.getContext("2d");
var startButton = document.getElementById("buttonStart");
var requestID;
var player

class Player {
    constructor() {
        this.x = 160;
        this.y = 400;
        this.prevy = 400;
        this.yvel = 0;
        this.alive = true;

        //For making the collision box where the player would die if the box collides with a block object
        this.blockHurtboxXMin = 5;
        this.blockHurtboxXMax = 35
        this.blockHurtboxYMin = 0;
        this.blockHurtboxYMax = 38;

        //For making the collision box where the player lands on top of a block or the ground
        this.blockHitboxXMin = 0;
        this.blockHitboxXMax = 40;
        this.blockHitboxYMin = 38;
        this.blockHitboxYMax = 40;

        //For making the collision box where the player dies when they touch a spike object
        this.spikeHurtboxXMin = 5;
        this.spikeHurtboxXMax = 35;
        this.spikeHurtboxYMin = 0;
        this.spikeHurtboxYMax = 40;

        this.onSurface = true;
        this.jumping = false
        this.canFastFall = false;
    }

    position() {
        return [this.x, this.y];
    }

    jump() {
        this.onSurface = false;
        this.jumping = true;
        this.y -= 2;
        this.yvel = 7;
        setTimeout(() => {
            console.log('hm');
            this.jumping = false;
        }, 100);
        return;
    }

    fastFall() {
        this.yvel = -15;
        this.canFastFall = false;
    }

    collisionDetection() {
        var block;
        var checkLanding = true;
        for (var i = 0; i < obstacles.length; i++) {
            block = obstacles[i];
            if (block.type == "Solid" || block.type == "Ground") {
                // Check if colliding into a wall horizontally
                if (checkIntersecting(this.x + this.blockHurtboxXMin, this.x + this.blockHurtboxXMax, this.y + this.blockHurtboxYMin, this.y + this.blockHurtboxYMax, block.x, block.x + block.width, block.y, block.y + block.height)) {
                    // If your hurtbox is currently intersecting with a wall, check if your y position in the previous frame was also overlapping with the y position of the block currently
                    // and whether it was greater (player was below) than the y position of the block currently. If it was not overlapping and the previous y position was less than (player was above the block previously) 
                    // the y position of the block currently, then you were above the block and fell on to it, so the player shouldn't die, but rather be moved to the top of the block instead.
                    if (checkIntersectingY(this.prevy + this.blockHurtboxYMin, this.prevy + this.blockHurtboxYMax, block.y, block.y + block.height) || this.prevy > block.y) {
                        console.log("killed by" + block.type);
                        this.alive = false;
                    }
                    else {
                        this.onSurface = true;
                        this.jumping = false;
                        this.canFastFall = true;
                        this.yvel = 0;
                        this.y = block.y - 40;
                    }
                }
                // Check if landing on top of a block, stops checking for this if it find that you are on top of at least 1 solid block
                if (checkLanding) {
                    if (checkIntersecting(this.x + this.blockHitboxXMin, this.x + this.blockHitboxXMax, this.y + this.blockHitboxYMin, this.y + this.blockHitboxYMax, block.x, block.x + block.width, block.y, block.y + block.height)) {
                        if (!this.jumping) {
                            console.log("intersecting with" + block.type);
                            this.onSurface = true;
                            this.jumping = false;
                            this.canFastFall = true;
                            this.yvel = 0;
                        }
                        checkLanding = false;
                    }
                    else {
                        this.onSurface = false;
                    }
                }
            }
            else if (block.type == "Spike") {
                // Check if colliding with a spike block (kills if touching from anywhere)
                if (checkIntersecting(this.x + this.spikeHurtboxXMin, this.x + this.spikeHurtboxXMax, this.y + this.spikeHurtboxYMin, this.y + this.spikeHurtboxYMax, block.x, block.x + block.width, block.y, block.y + block.height)) {
                    console.log("killed by" + block.type);
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
        if (!this.onSurface) {
            this.prevy = this.y;
            this.y -= this.yvel;
            if (this.yvel > -9) {
                this.yvel -= 0.18;
            }
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

class PlayerTrail {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alpha = 0.8;
        // For alternative animation
        // this.sizeModifier = 0;
    }

    physics() {
        this.x -= 4;
        if (this.alpha > 0.2) {
            this.alpha -= 0.02;
        }
        // For alternative animation
        // this.sizeModifier *= 0.95;
    }
}

var checkIntersecting = (aXMin, aXMax, aYMin, aYMax, bXMin, bXMax, bYMin, bYMax) => {
    var xIntersection = checkIntersectingX(aXMin, aXMax, bXMin, bXMax)
    var yIntersection = checkIntersectingY(aYMin, aYMax, bYMin, bYMax)
    /*
    if (xIntersection && yIntersection) {
        console.log("We intersectin!");
    }
    */
    return (xIntersection && yIntersection);
}

var checkIntersectingY = (aYMin, aYMax, bYMin, bYMax) => {
    //console.log("yintersection");
    //console.log(aYMin + " " + aYMax + " " + bYMin + " " + bYMax);
    return (aYMin >= bYMin && aYMin <= bYMax) || (aYMax >= bYMin && aYMax <= bYMax);
}

var checkIntersectingX = (aXMin, aXMax, bXMin, bXMax) => {
    //console.log("xintersection");
    //console.log(aXMin + " " + aXMax + " " + bXMin + " " + bXMax);
    return (aXMin >= bXMin && aXMin <= bXMax) || (aXMax >= bXMin && aXMax <= bXMax);
}

var clear = (e) => {
    ctx.clearRect(0, 0,c.width,c.height);
};

var startGame = (e) => {
    clear(e);
    obstacles.push(new Block(0, 440, 1200, 60, 'Ground'));
    player = new Player();

    runGame(e);
}

var runGame = (e) => {
    window.cancelAnimationFrame(requestID);
    clear(e);
    playerTrails.push(new PlayerTrail(player.x, player.y));
    player.physics();
    player.collisionDetection();
    ctx.fillStyle = "green";
    ctx.shadowColor = "yellow";
    ctx.shadowBlur = 15;
    ctx.fillRect(player.x, player.y, 40, 40);
    ctx.shadowColor = "black";
    ctx.shadowBlur = 0;
    for (var i = 0; i < playerTrails.length; i++) {
        playerTrails[i].physics();
        ctx.globalAlpha = playerTrails[i].alpha;
        ctx.fillRect(playerTrails[i].x, playerTrails[i].y, 40, 40);
        // For alternative animation
        // ctx.fillRect(playerTrails[i].x, playerTrails[i].y + 40 - playerTrails[i].sizeModifier * 40, playerTrails[i].sizeModifier * 40, playerTrails[i].sizeModifier * 40);
    }
    ctx.globalAlpha = 1.0;
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
    // For these parts where you remove an object from the array, make sure NOT to do obstacles = obstacles.splice(i, 1)
    // as obstacles.splice(i,1) actually returns an array containing the objects that you removed, NOT the original array
    // without those objects.
    for (var i = obstacles.length - 1; i > 0; i--) {
        if (obstacles[i].x < -100) {
            if (obstacles[i].type == "Ground") {
                console.log("removing ground");
            }
            obstacles.splice(i, 1);
            //console.log("There are " + obstacles.length + " block objects left");
        }
    }
    for (var i = playerTrails.length - 1; i > -1; i--) {
        if (playerTrails[i].x < -40) {
            playerTrails.splice(i, 1);
            //console.log("There are " + playerTrails.length + " trail objects left");
        }
    }
    blockSpawnRNG = Math.floor(Math.random() * 200);
    if (blockSpawnRNG == 199) {
        blockSpawnRNG = Math.floor(Math.random() * 2);
        if (blockSpawnRNG == 1) {
            obstacles.push(new Block(1100, 360, 40, 80, 'Spike'));
        }
        else {
            obstacles.push(new Block(1100, 360, 40, 80, 'Solid'));
        }
    }
    requestID = window.requestAnimationFrame(runGame);
}

//Later change this to store player inputs from multiple clients, which will then execute the code for each corresponding player
document.addEventListener("keydown", (e) => {
    // Make player jump
    if (e.key == ' ') {
        if (player.onSurface && !player.jumping) {
            player.jump();
            console.log("jumpy time");
        }
    }
    // Make player fast fall
    if (e.key == 'ArrowDown') {
        if (!player.onSurface && !player.jumping && player.canFastFall) {
            player.fastFall();
            console.log("fasty fall");
        }
    }
});

startButton.addEventListener("click", startGame);