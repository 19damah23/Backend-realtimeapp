const express = require("express");
const router = express.Router();

// routes
const authRoutes = require("./auth");
const userRoutes = require("./users");
const chatRoutes = require("./chats");

router
  .use("/auth", authRoutes)
  .use("/users", userRoutes)
  .use("/chats", chatRoutes);

module.exports = router;
