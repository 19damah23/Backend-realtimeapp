require("dotenv").config();

// creating express instance
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./src/routes");
const fileUpload = require('express-fileupload');
const http = require("http").createServer(app);
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const modelChats = require("./src/models/chats");
const { v4: uuid } = require("uuid");
const moment = require("moment");
moment.locale("id");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(fileUpload());
app.use('/files', express.static(__dirname + '/src/assets'))
app.use("/v1", router);

app.use("*", (req, res) => {
  res.status(404).json({
    message: "url not found",
  });
});

// creating socket io instance
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  const token = socket.handshake.query.token;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name == "TokenExpiredError")
        return res.status(403).send({ message: "Token expired" });
      if (err.name == "JsonWebTokenError")
        return res.status(403).send({ message: err.message });
      if (err.name == "NotBeforeError")
        return res.status(403).send({ message: "Token not active" });
    }

    socket.userId = decoded.id;
    socket.join(decoded.id);

    next();
  });
});

io.on("connection", function (socket) {
  console.log("User connected", socket.userId);

  // attach incoming listener for new user
  socket.on("userConnected", function (userId) {
    // save in array
    users[userId] = socket.id;

    // socket id will be used to send message to individual person
    // notify all connected clients
    io.emit("userConnected", userId);
  });

  socket.on("sendMessage", (data, callback) => {
    const dataMessage = {
      id: uuid().split("-").join(""),
      sender: socket.userId,
      receiver: data.receiver,
      message: data.message,
      createdAt: new Date(),
    };
    callback({
      ...dataMessage,
      createdAt: moment(dataMessage.createdAt).format("LT"),
    });
    modelChats.insertChat(dataMessage).then(() => {
      socket.broadcast.to(dataMessage.receiver).emit("newMessage", {
        ...dataMessage,
        createdAt: moment(dataMessage.created_at).format("LT"),
      });
    });
  });

  socket.on("disconnect", () => {
    console.log("Client terputus", socket.id);
  });
});

app.use((err, req, res, next) => {
  res.status(req.status || 500).json({
    message: err.message,
  });
});

// start the server
http.listen(process.env.PORT, function () {
  console.log(`Server started on port ${process.env.PORT}`);
});
