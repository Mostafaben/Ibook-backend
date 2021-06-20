const { body } = require('express-validator');
const {
  http_reponse_code: { NOT_FOUND },
} = require('../../enums/enums');
const { Author } = require('../../models/models');
const { HttpErrorHandler, HttpError } = require('../../utils/error_handlers');

const createAuthorMiddleware = [
  body('name').notEmpty().isLength({ min: 6, max: 40 }),
];

async function authorExistsMiddleware(req, res, next) {
  try {
    const { id_author } = req.params;
    const author = await Author.findByPk(id_author);
    if (!author) throw new HttpError('author does not exist', NOT_FOUND);
    req.author = author;
    next();
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

module.exports = { createAuthorMiddleware, authorExistsMiddleware };
