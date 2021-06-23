const { body } = require('express-validator'),
  { Book, Book_Images } = require('../../models/book'),
  { HttpErrorHandler, HttpError } = require('../../utils/error_handlers');
const {
  http_response_code: { NOT_FOUND, SUCCESS, UNAUTHORIZED },
} = require('../../enums/enums');

const createBookMiddleware = [
  body('name')
    .notEmpty({ ignore_whitespace: true })
    .isLength({ min: 4, max: 30 }),
  body('etat').isInt().notEmpty(),
];

async function isOwner(req, res, next) {
  try {
    const {
      user: { id_user },
      book,
    } = req;
    if (book.UserId != id_user)
      throw new HttpError('unauthorized', UNAUTHORIZED);
    next();
  } catch (error) {
    return HttpErrorHandler(res, error);
  }
}

async function bookExists(req, res, next) {
  try {
    const {
      params: { id_book },
    } = req;
    const book = await Book.findByPk(id_book);
    if (!book) throw new HttpError('book does not exits', NOT_FOUND);
    req.book = book;
    next();
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function isImageBelongsToBook(req, res, next) {
  try {
    const {
      params: { id_image },
      book,
    } = req;
    const bookImage = await Book_Images.findByPk(id_image);
    if (bookImage.BookId != book.id)
      throw new HttpError('image does not belong to book');
    req.bookImage = bookImage;
    next();
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

module.exports = {
  createBookMiddleware,
  isOwner,
  isImageBelongsToBook,
  bookExists,
};
