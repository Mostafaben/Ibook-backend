const { handleHttpError } = require('./../../utils/error_handlers');
const FILES_PATH = './../../uploads/';
const BOOKS_PATH = `${FILES_PATH}books/`;
const USERS_PATH = `${FILES_PATH}/users/`;
const AUTHORS_PATH = `${FILES_PATH}/authors/`;

const path = require('path');

async function getBookImage(req, res) {
  try {
    const image_path = path.join(__dirname, BOOKS_PATH + req.params.image_name);
    res.status(200).sendFile(image_path);
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function getUserImage(req, res) {
  try {
    const image_path = path.join(__dirname, USERS_PATH + req.params.image_name);
    res.status(200).sendFile(image_path);
  } catch (error) {
    handleHttpError(res, error, 404);
  }
}

async function getAuthorImage(req, res) {
  try {
    const image_path = path.join(
      __dirname,
      AUTHORS_PATH + req.params.image_name
    );
    res.status(200).sendFile(image_path);
  } catch (error) {
    handleHttpError(res, error, 404);
  }
}

module.exports = { getUserImage, getBookImage, getAuthorImage };
