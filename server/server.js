const io = require("socket.io")(3000, {
    cors: {
        origin: ['http://localhost:8080']
    } // this stuff is required to stop connection errors, socket running on port 3000, but server running on 8081
});

// this is for everyone, this is global handles all messages being sent
io.on("connection",socket => {
    console.log(socket.id);
    // This is the the stuff that works outside of joining room, basic functionality, need to keep but least
    // important to understand about websockets
    socket.on("send-message", (message, room) => {
        // console.log("this is room" + room);
        if (room === '') {
            // socket.broadcast.emit("recieve-message",message); 
            
            //Do not uncomment this otherwise everyone who is on
            // localhost:8080 will see your messages meaning that their canvas will get painted even though you are not
            // playing together
        }
        else {
            socket.to(room).emit("recieve-message",message);
        }
        
    });
    // most important
    // This allows people to join a room and communitcate with each other directly
    // You are permantly a member of every room you join until you refresh I believe
    // There is a way to leave the rooms, but too lazy to figure that out: https://socket.io/docs/v3/rooms/
    socket.on("join-room", (room,cb) => {
        socket.join(room); // joins the actual room
        console.log("now this is rooom  " + room)
        cb(`Joined the ${room} room`); // this just adds the new <p> element to tell you what room you joined
    });

});