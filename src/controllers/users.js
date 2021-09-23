const userModels = require("../models/users");
const { v4: uuid } = require("uuid");
const path = require("path");

const uploadAvatarHandler = async (req) => {
  if (req.files === null) {
    throw new Error("Image vehicles cannot be null");
  }

  const allowedExtension = [".png", ".jpg", ".jpeg"];
  const { avatar: file } = req.files;
  const extension = path.extname(file.name);

  if (file.size > 3 * 1024 * 1024) {
    throw new Error(`File size to large!`);
  }

  if (!allowedExtension.includes(extension)) {
    throw new Error(`File type ${extension} are not supported!`);
  }

  const fileName = `${uuid().split("-").join("")}${extension}`;
  const outputPath = path.join(__dirname, `/../assets/${fileName}`);

  await file.mv(outputPath);

  return {
    message: "Successfully uploaded",
    fileName: fileName,
  };
};

const getUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { page, perPage, search } = req.query;

    const users = await userModels.getUser(id, page, perPage, search)

    res.status(200);
    res.json({
      users
    });
  } catch (error) {
    next(new Error(error.message))
  }
}

const updatePhoneUser = async (req, res, next) => {
  try {
    const id = req.user.id
    const { phone } = req.body

    await userModels.updatePhoneUser(id, phone)

    res.status(200);
    res.json({
      message: 'Succesfully update phone!'
    });
  } catch (error) {
    next(new Error(error.message))
  }
}

const updateUsernameUser = async (req, res, next) => {
  try {
    const id = req.user.id
    const { username } = req.body

    await userModels.updateUsernameUser(id, username)

    res.status(200);
    res.json({
      message: 'Succesfully update username!'
    });
  } catch (error) {
    console.log(error.message)
    next(new Error(error.message))
  }
}

const updateBioUser = async (req, res, next) => {
  try {
    const id = req.user.id
    const { bio } = req.body

    await userModels.updateBioUser(id, bio)

    res.status(200);
    res.json({
      message: 'Succesfully update bio!'
    });
  } catch (error) {
    next(new Error(error.message))
  }
}

const updateAvatarUser = async (req, res, next) => {
  try {
    const id = req.user.id

    const avatar = await uploadAvatarHandler(req)

    await userModels.updateAvatarUser(id, avatar.fileName)

    res.status(200);
    res.json({
      message: 'Succesfully update avatar!'
    });
  } catch (error) {
    next(new Error(error.message))
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userModels.getUserProfile(id)

    res.status(200);
    res.json({
      user
    });
  } catch (error) {
    next(new Error(error.message))
  }
}

const getUserProfile = async (req, res, next) => {
  try {
    const id = req.user.id

    const user = await userModels.getUserProfile(id)

    res.status(200);
    res.json({
      user
    });
  } catch (error) {
    next(new Error(error.message))
  }
}

module.exports = {
  getUser,
  updatePhoneUser,
  getUserProfile,
  updateUsernameUser,
  updateBioUser,
  updateAvatarUser,
  getUserById
}