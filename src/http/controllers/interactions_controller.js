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
    const { id_offer } = req.params;
    const { id_user } = req.user;

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
    const { id_offer } = req.params;
    const { id_user } = req.user;
    const { price } = req.body;

    const offer = await Offer.findByPk(id_offer);
    if (!offer || offer.offer_type != offer_type.SELL) {
      return handleHttpError(res, new Error('offer does not exist'), 400);
    }

    const offer_respond = await Offer_Sell_Respond.create({
      OfferId: id_offer,
      price,
      UserId: id_user,
    });
    return res.status(200).send({ offer_respond, offer });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function respondToExchangeOffer(req, res) {
  try {
    const { id_book } = req.body;
    const { id_offer } = req.params;
    const { id_user } = req.user;

    const offer = await Offer.findByPk(id_offer);
    if (!offer || offer.offer_type != offer_type.EXCHANGE) {
      return handleHttpError(res, new Error('offer does not exist'), 400);
    }
    const offer_respond = await Offer_Exchange_Respond.create({
      BookId: id_book,
      UserId: id_user,
    });

    return res.status(200).send({ offer_respond, offer });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function deleteSellRespondById(req, res) {
  try {
    const { id_respond } = req.params;
    const { id_user } = req.user;
    const respond = await Offer_Sell_Respond.findByPk(id_respond);

    if (respond.UserId != id_user)
      return handleHttpError(res, new Error('unauthorized'), 403);

    await respond.destroy();
    return res.status(200).send({ message: 'respond was deleted' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function deleteExchangeRespondById(req, res) {
  try {
    const { id_respond } = req.params;
    const { id_user } = req.user;
    const respond = await Offer_Exchange_Respond.findByPk(id_respond);

    if (respond.UserId != id_user)
      return handleHttpError(res, new Error('unauthorized'), 403);

    await respond.destroy();
    return res.status(200).send({ message: 'respond was deleted' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

module.exports = {
  deleteExchangeRespondById,
  deleteSellRespondById,
  respondToExchangeOffer,
  respondToSellOffer,
  likeOffer,
};
