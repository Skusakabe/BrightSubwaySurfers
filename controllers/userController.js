// For managing game logic (game events and user inputs)
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
var requestID;

var players = {};

var p1x = 20;
var p1y = 200;

var p2x = 20;
var p2y = 200;

//For making the collision box where the player would die if the box collides with a block object
var blockHurtboxXMin = 5;
var blockHurtboxXMax = 35
var blockHurtboxYMin = 8;
var blockHurtboxYMax = 40

//For making the collision box where the player lands on top of a block or the ground
var blockHitboxXMin = 0;
var blockHitboxXMax = 40;
var blockHitboxYMin = 0;
var blockHitboxYMax = 8;

//For making the collision box where the player dies when they touch a spike object
var spikeHurtboxXMin = 5;
var spikeHurtboxXMax = 35;
var spikeHurtboxYMin = 0;
var spikeHurtboxYMax = 40;

