const { body } = require('express-validator');
const { Book } = require('../../models/book');
const { handleHttpError } = require('../../utils/error_handlers');

const createBookMiddleware = [
  body('name')
    .notEmpty({ ignore_whitespace: true })
    .isLength({ min: 4, max: 30 }),
  body('etat').isInt().notEmpty(),
];

async function isOwner(req, res, next) {
  const { id_book } = req.params;
  const { id_user } = req.user;
  const book = await Book.findByPk(id_book);
  if (book?.UserId != id_user)
    return handleHttpError(res, new Error('unauthorized'), 403);
  req.book = book;
  next();
}

module.exports = { createBookMiddleware, isOwner };
