// const express = require('express');
// const path = require('path');

// const app = express();
// const port = 5000;



// app.get("/", (req, res) =>{
//     res.sendFile(path.join(__dirname,'/index.html'))
// });



// app.listen(port, () => {
//     console.log(`listening on port: ${port}`)
// });
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // important for Socket.IO
const io = new Server(server);

const port = 3000;

// Serve static files (so index.html and script.js can be loaded)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on("connection", (socket) =>{
    console.log(`user connected: ${socket.id}`);

    // socket.on("test", (data) =>{
    // console.log(`test`)});

    socket.on("draw", (data) =>{
    console.log(`user drawing ${data}`);
    socket.broadcast.emit("draw", data);

   

    
    });
     socket.on('reset' ,()=>{
      socket.broadcast.emit('reset')
    });
    socket.on('size' ,(canvasSize)=>{
      console.log("user changed size")
      socket.broadcast.emit('size', canvasSize)
    });
});



// Start the server
server.listen(port, () => {
  console.log(`✅ Server running at: http://localhost:${port}`);
});
