const {
  HttpErrorHandler,
  HttpError,
  handleMiddlewareErrors,
} = require('../../utils/error_handlers');
const {
  Offer_Likes,
  Offer_Sell_Respond,
  Offer_Exchange_Respond,
} = require('../../models/offer');
const { offer_type } = require('../../enums/enums');
const { validationResult } = require('express-validator');

async function likeOffer(req, res) {
  try {
    const {
      params: { id_offer },
      user: { id_user },
    } = req;

    let like = await Offer_Likes.findOne({
      where: { UserId: id_user, OfferId: id_offer },
    });

    if (like) {
      like.destroy();
      return res
        .status(200)
        .send({ message: 'offer was unliked', success: true });
    }
    like = await Offer_Likes.create({ UserId: id_user, OfferId: id_offer });
    res.status(200).send({ like });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function respondToSellOffer(req, res) {
  try {
    const {
      offer: { id: id_offer, offer_type: type },
      user: { id_user },
      body: { price },
    } = req;

    if (!price || price <= 0)
      throw new HttpError('price is required and must be greated than zero');

    if (type != offer_type.SELL) throw new HttpError('type does not match');

    const offer_respond = await Offer_Sell_Respond.create({
      OfferId: id_offer,
      price,
      UserId: id_user,
    });

    return res.status(200).send({ offer_respond });
  } catch (error) {
    HttpErrorHandler(res, error, 400);
  }
}

async function respondToExchangeOffer(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(res, errors);

    const {
      params: { id_offer },
      user: { id_user },
      body: { BookId },
      offer: { offer_type: type },
    } = req;

    if (type != offer_type.EXCHANGE) throw new HttpError('type does not match');

    const offer_respond = await Offer_Exchange_Respond.create({
      BookId: BookId,
      UserId: id_user,
      OfferId: id_offer,
    });

    return res.status(200).send({ offer_respond });
  } catch (error) {
    HttpErrorHandler(res, error, 400);
  }
}

async function deleteOfferRespondById(req, res) {
  try {
    const { respond } = req;
    await respond.destroy();
    return res.status(200).send({ message: 'respond was deleted' });
  } catch (error) {
    HttpErrorHandler(res, error, 400);
  }
}

module.exports = {
  deleteOfferRespondById,
  respondToExchangeOffer,
  respondToSellOffer,
  likeOffer,
};
