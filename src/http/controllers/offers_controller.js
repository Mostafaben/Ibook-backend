const { validationResult } = require('express-validator');
const { Sequelize } = require('../../config/db_config');
const { offer_status } = require('../../enums/enums');
const {
  User,
  User_Image,
  Book,
  Book_Images,
  Offer,
  Offer_Likes,
} = require('../../models/models');

const {
  handleHttpError,
  handleMiddlewareErrors,
} = require('../../utils/error_handlers');

const PAGE_ELEMENTS = 10;

async function getOffers(req, res) {
  try {
    const { page } = req.query;

    const offers = await Offer.findAll({
      subQuery: false,
      where: {
        offer_status: offer_status.ACTIVE,
      },
      attributes: {
        include: [
          [Sequelize.fn('COUNT', Sequelize.col('Offer_Likes.id')), 'likes'],
        ],
      },
      include: [
        {
          model: Offer_Likes,
          required: false,
          attributes: [],
        },
        {
          model: Book,
          required: true,
          include: [
            { model: Book_Images, required: true, attributes: ['image_url'] },
          ],
        },
        {
          model: User,
          required: true,
          attributes: ['email', 'name'],
          include: [
            { model: User_Image, required: false, attributes: ['image_url'] },
          ],
        },
      ],
      limit: PAGE_ELEMENTS,
      offset: page * PAGE_ELEMENTS,
    });
    res.status(200).send({ offers, page, PAGE_ELEMENTS });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function createOffer(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(res, errors, 400);
    const { id_user } = req.user;
    const { BookId, offer_type } = req.body;
    const offer = await Offer.create({ BookId, offer_type, UserId: id_user });
    return res.status(201).send({ offer });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function deleteOffer(req, res) {
  try {
    await req.offer.destroy();
    return res.status(200).send({ message: 'offer was deleted' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function cancelOffer(req, res) {
  try {
    req.offer.offer_status = offer_status.CANCELED;
    await offer.save();
    return res.status(200).send({ offer });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

module.exports = { cancelOffer, deleteOffer, createOffer, getOffers };
