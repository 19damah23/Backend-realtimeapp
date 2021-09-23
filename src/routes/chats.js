const express = require("express");
const router = express.Router();

const chatControllers = require("../controllers/chats");
const auth = require("../middlewares/auth");

router
  .get("/:id", auth, chatControllers.getChats)
  .delete("/:id", auth, chatControllers.deleteHistory)

module.exports = router;
