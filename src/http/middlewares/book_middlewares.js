const { body } = require('express-validator');
const { Book, Book_Images } = require('../../models/book');
const { handleHttpError } = require('../../utils/error_handlers');

const createBookMiddleware = [
  body('name')
    .notEmpty({ ignore_whitespace: true })
    .isLength({ min: 4, max: 30 }),
  body('etat').isInt().notEmpty(),
];

async function isOwner(req, res, next) {
  try {
    const { id_book } = req.params;
    const { id_user } = req.user;
    const book = await Book.findByPk(id_book);
    if (!book)
      return handleHttpError(res, new Error('book does not exists'), 404);
    if (book.UserId != id_user)
      return handleHttpError(res, new Error('unauthorized'), 403);
    req.book = book;
    next();
  } catch (error) {
    return handleHttpError(res, error, 400);
  }
}

async function isBookOwner(req, res, next) {
  try {
    const { id_image } = req.params;
    const { id_user } = req.user;
    const bookImage = await Book_Images.findByPk(id_image);
    const book = await Book.findByPk(bookImage.BookId);
    if (book?.UserId != id_user)
      return handleHttpError(res, new Error('unauthorized'), 403);
    req.book = book;
    next();
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

module.exports = { createBookMiddleware, isOwner, isBookOwner };
