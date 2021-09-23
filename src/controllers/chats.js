const chatModels = require("../models/chats");
const moment = require("moment");
moment.locale("id");

const getChats = async (req, res, next) => {
  try {
    const id = req.user.id;
    const contactId = req.params.id
    const { page, perPage, search } = req.query;

    const results = await chatModels.getChats(id, contactId)

    let chats = []
    for (let i = 0; i < results.length; i++) {
      let result = results[i]
      result.createdAt = moment(results[i].createdAt).format("LT")
      chats.push(result)
    }

    res.status(200);
    res.json({
      chats
    });
  } catch (error) {
    next(new Error(error.message))
  }
}

const deleteHistory = async (req, res, next) => {
  try {
    const id = req.user.id
    const friendId = req.params.id

    await chatModels.deleteHistory(id, friendId)

    res.status(200);
    res.json({
      message: "Successfully delete chat history!"
    });
  } catch (error) {
    next(new Error(error.message))
  }
}

module.exports = {
  getChats,
  deleteHistory
}