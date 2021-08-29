const authModels = require("../models/auth")
const { v4: uuid } = require("uuid")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name) return res.status(400).send({ message: "username cannot be null" });
    if (!email) return res.status(400).send({ message: "email cannot be null" });
    if (!password) return res.status(400).send({ message: "password cannot be null" });
  
    const user = await authModels.findUser(email)
    if (user.length > 0) return res.status(400).send({ message: "email already exists" });

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        const date = new Date();
        const datetime = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()

        const data = {
          id: uuid().split("-").join(""),
          username,
          email,
          password: hash,
          status: "unactived",
          createdAt: datetime,
          updatedAt: datetime
        }

        authModels.register(data)
        delete data.password

        res.status(201);
         res.json({
           message: "Register success!",
           data
         });
      })
    })
  } catch (error) {
    next(new Error(error.message))
  }
}

module.exports = {
  register
}