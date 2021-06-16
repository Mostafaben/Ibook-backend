const { HttpErrorHandler, HttpError } = require('./../../utils/error_handlers');
const path = require('path');
const FILES_PATH = './../../uploads/';
const BOOKS_PATH = `${FILES_PATH}books/`;
const USERS_PATH = `${FILES_PATH}/users/`;
const AUTHORS_PATH = `${FILES_PATH}/authors/`;

async function getBookImage(req, res) {
  try {
    const image_path = path.join(__dirname, BOOKS_PATH + req.params.image_name);
    res.status(200).sendFile(image_path);
  } catch (error) {
    HttpErrorHandler(res, new HttpError(error.message, 404));
  }
}

async function getUserImage(req, res) {
  try {
    const image_path = path.join(__dirname, USERS_PATH + req.params.image_name);
    res.status(200).sendFile(image_path);
  } catch (error) {
    HttpErrorHandler(res, new HttpError(error.message, 404));
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
    HttpErrorHandler(res, new HttpError(error.message, 404));
  }
}

module.exports = { getUserImage, getBookImage, getAuthorImage };
