const { Op } = require('sequelize');
const { Sequelize } = require('../../config/db_config');
const { http_reponse_code, offer_type } = require('../../enums/enums');

const path = require('path'),
  fs = require('fs'),
  FILES_PATH = './../../uploads/',
  { HttpErrorHandler, HttpError } = require('./../../utils/error_handlers'),
  PAGE_ELEMENTS = 10,
  {
    Offer,
    Book,
    User,
    User_Image,
    Book_Images,
    Author,
    Category,
    Category_Image,
    Offer_Likes,
    Offer_Sell_Respond,
    Offer_Exchange_Respond,
  } = require('./../../models/models');

function generateOfferCountQuery(table) {
  return `(select count(*) from ${table}  where offer.id = ${table}.OfferId)`;
}

async function getImage(req, res) {
  try {
    const {
      params: { model_name, image_name },
    } = req;
    const fileRelativePath = `${FILES_PATH}/${model_name}/${image_name}`;
    const image_path = path.join(__dirname, fileRelativePath);
    if (!fs.existsSync(image_path))
      throw new HttpError('file does not exist', 404);
    res.status(200).sendFile(image_path);
  } catch (error) {
    HttpErrorHandler(res, new HttpError(error.message, 404));
  }
}

async function getRecentOffers(req, res) {
  try {
    let {
      query: { page = 0, offer_type: OfferType, BookId, AuthorId },
    } = req;

    const numberOfPages = Math.ceil((await Offer.count()) / PAGE_ELEMENTS);
    const offersQuery = {};
    const booksQuery = {};

    if (OfferType) {
      offersQuery.offer_type = OfferType;
    }
    if (BookId) {
      offersQuery.BookId = BookId;
    }
    if (AuthorId) {
      booksQuery.AuthorId = AuthorId;
    }

    const recentOffersIncludes = [
      [Sequelize.literal(generateOfferCountQuery('offer_likes')), 'likesCount'],
      [
        Sequelize.literal(generateOfferCountQuery('offer_sell_responds')),
        'sellRespondsCount',
      ],
      [
        Sequelize.literal(generateOfferCountQuery('offer_exchange_responds')),
        'exchangeRepondsCount',
      ],
    ];
    const recentOffers = await Offer.findAll({
      where: offersQuery,
      attributes: {
        exclude: ['updatedAt'],
        include: recentOffersIncludes,
      },
      include: [
        {
          model: Book,
          where: booksQuery,
          required: true,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'UserId', 'AuthorId'],
          },
          include: [
            {
              model: Book_Images,
              required: true,
              limit: 1,
              attributes: ['image_url'],
            },
            {
              model: Author,
              attributes: ['name'],
            },
          ],
        },
        {
          model: User,
          required: true,
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: User_Image,
              required: false,
              attributes: ['image_url'],
              limit: 1,
            },
          ],
        },
      ],
      limit: PAGE_ELEMENTS,
      offset: PAGE_ELEMENTS * page,
    });
    res.status(200).send({
      data: recentOffers,
      currentPage: page,
      pageElements: PAGE_ELEMENTS,
      numberOfPages: numberOfPages,
    });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
      include: {
        model: Category_Image,
        attributes: ['icon_url'],
        required: false,
      },
    });
    res.status(http_reponse_code.SUCCESS).send(categories);
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function getAuthors(req, res) {
  try {
    const {
      query: { AuthorId },
    } = req;
    let query = {};
    if (AuthorId) query.AuthorId = AuthorId;
    const authors = await Author.findAll({
      where: query,
      attributes: ['id', 'name', 'image_url'],
    });
    res.status(http_reponse_code.SUCCESS).send(authors);
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function getOfferLikes(req, res) {
  try {
    const {
      offer: { id: OfferId },
    } = req;

    const offerLikes = await Offer_Likes.findAll({
      where: { OfferId },
      attributes: ['createdAt'],
      include: [
        {
          model: User,
          required: true,
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: User_Image,
              required: false,
              attributes: ['image_url'],
              limit: 1,
            },
          ],
        },
      ],
    });
    res.status(200).send(offerLikes);
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function getOfferResponds(req, res) {
  try {
    const {
      offer: { id: OfferId, offer_type: type },
    } = req;
    let responds;
    const options = {
      where: { OfferId },
      attributes: { exclude: ['updatedAt'] },
      include: [
        {
          model: User,
          required: true,
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: User_Image,
              required: false,
              attributes: ['image_url'],
              limit: 1,
            },
          ],
        },
      ],
    };
    type == offer_type.SELL
      ? (responds = await Offer_Sell_Respond.findAll(options))
      : (responds = await Offer_Exchange_Respond.findAll(options));
    res.status(http_reponse_code.SUCCESS).send(responds);
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

module.exports = {
  getImage,
  getRecentOffers,
  getCategories,
  getAuthors,
  getOfferLikes,
  getOfferResponds,
};
