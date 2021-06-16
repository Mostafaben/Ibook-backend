const { handleHttpError } = require('../../utils/error_handlers');
const { Offer } = require('./../../models/models');

async function offerExistsMiddleware(req, res, next) {
  try {
    const { id_offer } = req.params;
    const offer = await Offer.findByPk(id_offer);
    if (!offer) throw new Error('offer does not exist');
    next();
  } catch (error) {
    handleHttpError(res, error, 404);
  }
}

async function respondExistsMiddleware(req, res, next) {
  try {
    const respond = await Offer_Sell_Respond.findByPk(id_respond);
    if (!respond) throw new Error('respond does not exist');
    if (respond.UserId != id_user)
      return handleHttpError(res, new Error('unauthorized'), 403);
    req.respond = respond;
    next();
  } catch (error) {
    handleHttpError(res, error, 404);
  }
}

module.exports = { offerExistsMiddleware, respondExistsMiddleware };
