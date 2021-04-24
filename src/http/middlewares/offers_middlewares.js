const { body } = require('express-validator');
const { Offer } = require('./../../models/models');
const { handleHttpError } = require('./../../utils/error_handlers');

const createOfferMiddleware = [
  body('BookId').isNumeric().notEmpty(),
  body('offer_type').custom((value) => {
    if (value > 1 || value < 0) throw new Error('not valid');
    return true;
  }),
];

async function isOfferOwner(req, res, next) {
  try {
    const { id_user } = req.user;
    const { id_offer } = req.params;
    const offer = await Offer.findByPk(id_offer);
    if (offer.UserId != id_user)
      return handleHttpError(res, new Error('unauthorized'), 403);
    req.offer = offer;
    next();
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

module.exports = {
  isOfferOwner,
  createOfferMiddleware,
};
