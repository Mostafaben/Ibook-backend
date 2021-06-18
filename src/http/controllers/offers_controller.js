const { validationResult } = require('express-validator');
const { offer_status } = require('../../enums/enums');
const {
  User,
  User_Image,
  Book,
  Book_Images,
  Offer,
  Offer_Likes,
  Author,
} = require('../../models/models');
const {
  HttpErrorHandler,
  handleMiddlewareErrors,
} = require('../../utils/error_handlers');

const PAGE_ELEMENTS = 10;

async function getOffers(req, res) {
  try {
    let {
      query: { page },
    } = req;
    page ? page : (page = 0);

    const offers = await Offer.findAll({
      subQuery: false,
      where: {
        offer_status: offer_status.ACTIVE,
      },
      include: [
        {
          model: Offer_Likes,
          required: false,
          attributes: ['id', 'UserId', 'createdAt'],
        },
        {
          model: Book,
          required: true,
          include: [
            {
              model: Book_Images,
              required: true,
              attributes: ['image_url', 'id'],
            },
            {
              model: Author,
              required: true,
              attributes: ['id', 'name', 'image_url'],
            },
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
    res
      .status(200)
      .send({ offers, currentPage: page, pageElements: PAGE_ELEMENTS });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function createOffer(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(res, errors, 400);
    const {
      user: { id_user },
      body: { BookId, offer_type },
    } = req;
    const offer = await Offer.create({ BookId, offer_type, UserId: id_user });
    return res.status(201).send({ offer });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function deleteOffer(req, res) {
  try {
    await req.offer.destroy();
    return res.status(200).send({ message: 'offer was deleted' });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function cancelOffer(req, res) {
  try {
    req.offer.offer_status = offer_status.CANCELED;
    await offer.save();
    return res.status(200).send({ offer });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

module.exports = { cancelOffer, deleteOffer, createOffer, getOffers };
