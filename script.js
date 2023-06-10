// this will not work if this js file is imported in index.html without the "type="module"" tag
import { io } from 'socket.io-client';

var room = "";

var roomInput = document.getElementById("room");
//retrieve node in DOM via ID
var c = document.getElementById("slate");

//instantiate a CanvasRenderingContext2D object
var ctx = c.getContext("2d");

//init globar state var
var mode = "rect";

//var toggleMode = function(e){
var toggleMode = (e) => {
    console.log("toggling...");
    var text = document.getElementById("buttonToggle");
    if (mode === "rect") {
        mode = "circ";
        text.innerHTML = "circle";
    }
    else {
        mode = "rect";
        text.innerHTML = "rectangle"
    }
}

var drawRect = function(X,Y) {
    var mouseX = X; //gets X-coor of mouse when event is fired
    var mouseY = Y; //gets Y-coor of mouse when event is fired
    console.log("mouseclick registered at ", mouseX, mouseY);
    ctx.fillStyle = "blue";
    ctx.fillRect(mouseX, mouseY, 100, 50);
}

var drawCircle = function(X,Y) {
    var mouseX = X; //gets X-coor of mouse when event is fired
    var mouseY = Y; //gets Y-coor of mouse when event is fired
    console.log("cirlce: mouseclick registered at ", mouseX, mouseY);
    ctx.fillStyle = "green";
    ctx.arc(mouseX,mouseY,10,0,Math.PI*2);
    ctx.fill();
}

var draw = function(X,Y) {


    if (mode == "rect") {
        drawRect(X,Y);
    }
    else {
        ctx.beginPath()
        drawCircle(X,Y);
    }
    
}

var clear = function(e) {
    ctx.clearRect(0, 0, c.width, c.height);
}




// This is where socket client starts taking over, this is for each individual people, so what each person
// does when they recieve a certain message
const socket = io("http://localhost:3000");
// on a connect message through websockets
socket.on("connect", () => {
    // this just creates a new p tag and shows the socket that you connected with
    var new_p = document.createElement("p");
    new_p.innerHTML = `You connected with id ${socket.id}`;
    document.body.appendChild(new_p);

    // socket.emit('custom-event',10,"Hi",{a : "a"})
});

socket.on("recieve-message",(message,room) => {
    draw(message[0],message[1]);
})




c.addEventListener("click", e => {
    // console.log("clicked");
    // console.log(e);
    // console.log(e.offsetX);

    e.preventDefault(); // I don't think you need this here but just in case
    var msg = [e.offsetX,e.offsetY]; // this is the message that is sent over to the other people through websockets
    // this is the data that will draw the stuff on the canvas, you can probably send a json and then parse it in 
    // what is on line 80 in this file 
    // here: 
                // socket.on("recieve-message",(message,room) => {
                //     draw(message[0],message[1]); // this stuff parses the data and draws the stuff on each individual persons screen
                // })
    socket.emit("send-message",msg,room); // this actually sends the stuff to the specified person

    if (mode == "rect") {
        drawRect(e.offsetX,e.offsetY);
    }
    else {
        ctx.beginPath()
        drawCircle(e.offsetX,e.offsetY);
    }
})

var joinRoom = document.getElementById("join-room");
joinRoom.addEventListener("click",() => {
    room = roomInput.value;
    
    // this code allows the bi directional commmunication between "rooms"
    // This is how we will allow people to join the same lobbies
    socket.emit("join-room",room,function(message) { // the function here just adds a <p> element to tell you what room you joined
        var new_p = document.createElement("p");
        new_p.innerHTML = message;
        document.body.appendChild(new_p);
    });
})

var toggle = document.getElementById("buttonToggle");
toggle.addEventListener("click",toggleMode);

var wipe = document.getElementById("buttonClear");
wipe.addEventListener("click",clear);
