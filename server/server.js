const io = require("socket.io")(3000, {
    cors: {
        origin: ['http://localhost:8080']
    }
});

io.on("connection",socket => {
    console.log(socket.id);
    socket.on("custom-event", (number,string,obj) => {
        console.log(number,string,obj)
    });
    socket.on("send-message", message => {
        console.log(message[0], message[1]);
        socket.broadcast.emit("recieve-message",message);
    });
});