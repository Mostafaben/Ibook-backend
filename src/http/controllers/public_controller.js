const { handleHttpError } = require('./../../utils/error_handlers');
const booksPath = './../../uploads/books/';
const usersPath = './../../uploads/users/';
const path = require('path');

async function getBookImage(req, res) {
  try {
    const image_path = path.join(__dirname, booksPath + req.params.image_name);
    res.status(200).sendFile(image_path);
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function getUserImage(req, res) {
  try {
    const image_path = path.join(__dirname, usersPath + req.params.image_name);
    res.status(200).sendFile(image_path);
  } catch (error) {
    handleHttpError(res, error, 404);
  }
}

module.exports = { getUserImage, getBookImage };
