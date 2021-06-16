const { offer_type } = require('../../enums/enums');
const {
  Offer_Likes,
  Offer,
  Offer_Sell_Respond,
  Offer_Exchange_Respond,
} = require('../../models/offer');
const { handleHttpError } = require('../../utils/error_handlers');

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
    } else {
      like = await Offer_Likes.create({ UserId: id_user, OfferId: id_offer });
    }
    res.status(200).send({ like });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function respondToSellOffer(req, res) {
  try {
    const {
      params: { id_offer },
      user: { id_user },
      body: { price },
    } = req;
    const offer_respond = await Offer_Sell_Respond.create({
      OfferId: id_offer,
      price,
      UserId: id_user,
    });
    return res.status(200).send({ offer_respond });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function respondToExchangeOffer(req, res) {
  try {
    const {
      params: { id_offer },
      user: { id_user },
      body: { id_book },
    } = req;

    const offer_respond = await Offer_Exchange_Respond.create({
      BookId: id_book,
      UserId: id_user,
      OfferId: id_offer,
    });

    return res.status(200).send({ offer_respond });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function deleteOfferRespondById(req, res) {
  try {
    const { respond } = req;
    await respond.destroy();
    return res.status(200).send({ message: 'respond was deleted' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

module.exports = {
  deleteOfferRespondById,
  respondToExchangeOffer,
  respondToSellOffer,
  likeOffer,
};
