const http = require('http')
const { Server } = require('socket.io')

// Create the HTTP server
const httpServer = http.createServer((req, res) => {
  // Return a 404 for all requests
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

// Create the Socket.IO server
const wsServer = new Server(httpServer, {
  path: "/rtc"
});

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    console.log(`roomName=${roomName}에서 join_room 받음`)
    console.log(socket.client.id)
    socket.join(roomName); 
    socket.to(roomName).emit("welcome", {userId : socket.client.id}); 
  });

  socket.on("offer", (offer, roomName) => {
    console.log(`roomName=${roomName}에서 offer 받음`)
    console.log("offer : ", offer)
    const obj = {
      userId : socket.client.id,
      offer : offer
    }
    socket.to(roomName).emit("offer", obj);
  });

  socket.on("answer", ({answer, toUserId, roomName}) => {
    console.log(`roomName=${roomName}에서 answer 받음`)
    console.log("answer : ", answer)
    const obj = {
      userId : socket.client.id,
      answer : answer,
      toUserId : toUserId
    }
    socket.to(roomName).emit("answer", obj);
  });

  socket.on("ice", (ice, roomName) => {
    console.log(`roomName=${roomName}에서 ice 받음`)
    console.log("ice : ",ice)
    const obj = {
      userId : socket.client.id,
      candidate : ice
    }
    socket.to(roomName).emit("ice", obj);
  });
});

// Start the server
const handleListen = () => console.log(`Listening on http://localhost:3001`);
httpServer.listen(3001, handleListen);
