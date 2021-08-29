require("dotenv").config();

// creating express instance
const express = require("express");
const app = express();
const cors = require("cors")
const router = require("./src/routes")

app.use(express.json());
app.use(cors());
app.use("/v1", router);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'url not found',
  });
});

// creating http instance
const http = require("http").createServer(app);

// creating socket io instance
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

let users = [];

io.on("connection", function(socket) {
  console.log("User connected", socket.id)

  // attach incoming listener for new user
  socket.on("userConnected", function (username) {
    // save in array
    users[username] = socket.id

    // socket id will be used to send message to individual person
    // notify all connected clients
    io.emit("userConnected", username)
  })

  socket.on("sendMessage", function (data) {
    // send event to receriver
    const socketId = users[data.receiver]

    io.to(socketId).emit("newMessage", data)
  })
})

app.use((err, req, res, next) => {
  res.status(req.status || 500).json({
    message: err.message
  });
});

// start the server
http.listen(process.env.PORT, function () {
  console.log(`Server started on port ${process.env.PORT}`);
});
