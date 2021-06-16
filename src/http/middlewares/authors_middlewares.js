const { body } = require('express-validator');
const { Author } = require('../../models/models');
const { handleHttpError } = require('../../utils/error_handlers');

const createAuthorMiddleware = [
  body('name').notEmpty().isLength({ min: 6, max: 40 }),
];

async function authorExistsMiddleware(req, res, next) {
  try {
    const { id_author } = req.params;
    const author = await Author.findByPk(id_author);
    if (!author) throw new Error('author does not exist');
    req.author = author;
    next();
  } catch (error) {
    handleHttpError(res, error, 404);
  }
}

module.exports = { createAuthorMiddleware, authorExistsMiddleware };
