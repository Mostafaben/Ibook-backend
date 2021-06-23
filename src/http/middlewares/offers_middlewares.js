const { body } = require('express-validator');
const {
  http_response_code: { UNAUTHORIZED, NOT_FOUND },
} = require('../../enums/enums');
const { Offer } = require('./../../models/models');
const { HttpErrorHandler, HttpError } = require('./../../utils/error_handlers');

const createOfferMiddleware = [
  body('BookId').isNumeric().notEmpty(),
  body('offer_type').custom((value) => {
    if (value > 1 || value < 0) throw new Error('not valid');
    return true;
  }),
];

async function isOfferOwner(req, res, next) {
  try {
    const {
      offer: { id },
      user: { id_user },
    } = req;
    if (id != id_user) throw new HttpError('unauthorized', UNAUTHORIZED);
    next();
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function OfferExists(req, res, next) {
  try {
    const {
      params: { id_offer },
    } = req;
    const offer = await Offer.findByPk(id_offer);
    if (!offer) throw new HttpError('offer does not exit', NOT_FOUND);
    req.offer = offer;
    next();
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

module.exports = {
  isOfferOwner,
  createOfferMiddleware,
  OfferExists,
};
