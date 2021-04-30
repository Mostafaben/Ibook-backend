const router = require('express').Router();
const { handleHttpError } = require('./../../utils/error_handlers');
const booksPath = './../../uploads/books/';
const usersPath = './../../uploads/users/';
const path = require('path');

router.get('/books/:image_name', (req, res) => {
  try {
    const image_path = path.join(__dirname, booksPath + req.params.image_name);
    res.status(200).sendFile(image_path);
  } catch (error) {
    handleHttpError(res, error, 400);
  }
});

router.get('/user/:image_name', (req, res) => {
  try {
    const image_path = path.join(__dirname, usersPath + req.params.image_name);
    res.status(200).sendFile(image_path);
  } catch (error) {
    handleHttpError(res, error, 404);
  }
});

module.exports = router;
