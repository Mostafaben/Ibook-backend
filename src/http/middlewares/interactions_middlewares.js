const { body } = require('express-validator');
const {
  handleHttpError,
  HttpErrorHandler,
  HttpError,
} = require('../../utils/error_handlers');
const { Offer } = require('./../../models/models');

async function respondExistsMiddleware(req, res, next) {
  try {
    const respond = await Offer_Sell_Respond.findByPk(id_respond);
    if (!respond) throw new HttpError('respond does not exist');
    req.respond = respond;
    next();
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

const createExchangeRespondsMiddleware = [
  body('BookId').notEmpty().isNumeric(),
];

async function isRespondOwnerMiddleware(req, res, next) {
  try {
    const {
      respond,
      user: { id_user },
    } = req;
    if (respond.UserId != id_user) throw new HttpError('unauthorized', 403);
    next();
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

module.exports = {
  respondExistsMiddleware,
  isRespondOwnerMiddleware,
  createExchangeRespondsMiddleware,
};
