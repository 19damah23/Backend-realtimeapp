const conn = require("../configs/db");

const insertChat = (data) =>
  new Promise((resolve, reject) => {
    conn.query("INSERT INTO chats SET ?", data, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });

const getChats = (id, idContact) =>
  new Promise((resolve, reject) => {
    conn.query(
      `SELECT * FROM chats WHERE sender = '${id}' AND receiver = '${idContact}' OR sender = '${idContact}' AND receiver = '${id}' ORDER BY createdAt ASC`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });

const deleteHistory = (id, idContact) => new Promise((resolve, reject) => {
  conn.query(`DELETE FROM chats WHERE sender = '${id}' AND receiver = '${idContact}' OR sender = '${idContact}' AND receiver = '${id}'`, (error, result) => {
    if (!error) {
      resolve(result)
    } else {
      reject(error)
    }
  })
})

module.exports = {
  insertChat,
  getChats,
  deleteHistory
};
