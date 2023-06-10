import { io } from 'socket.io-client';


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


const socket = io("http://localhost:3000");
socket.on("connect", () => {
    var new_p = document.createElement("p");
    new_p.innerHTML = `You connected with id ${socket.id}`;
    document.body.appendChild(new_p);

    socket.emit('custom-event',10,"Hi",{a : "a"})
});

socket.on("recieve-message",message => {
    draw(message[0],message[1]);
})




// c.addEventListener("click", draw); //passes the mouse event as parameter for the function

c.addEventListener("click", e => {
    console.log("clicked");
    console.log(e);
    console.log(e.offsetX);

    e.preventDefault();
    socket.emit("send-message",[e.offsetX,e.offsetY]);

    if (mode == "rect") {
        drawRect(e.offsetX,e.offsetY);
    }
    else {
        ctx.beginPath()
        drawCircle(e.offsetX,e.offsetY);
    }
})

var toggle = document.getElementById("buttonToggle");
toggle.addEventListener("click",toggleMode);

var wipe = document.getElementById("buttonClear");
wipe.addEventListener("click",clear);
