const { Sequelize } = require('../../config/db_config');

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
  } = require('./../../models/models');

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

const generateOfferCountQuery = (table) => {
  return `(select count(*) from ${table}  where offer.id = ${table}.OfferId)`;
};

async function getRecentOffers(req, res) {
  try {
    let {
      query: { page = 0 },
    } = req;

    const numberOfPages = Math.ceil((await Offer.count()) / PAGE_ELEMENTS);
    const recentOffers = await Offer.findAll({
      attributes: {
        exclude: ['updatedAt'],
        include: [
          [
            Sequelize.literal(generateOfferCountQuery('offer_likes')),
            'likesCount',
          ],
          [
            Sequelize.literal(generateOfferCountQuery('offer_sell_responds')),
            'sellRespondsCount',
          ],
          [
            Sequelize.literal(
              generateOfferCountQuery('offer_exchange_responds')
            ),
            'exchangeRepondsCount',
          ],
        ],
      },
      include: [
        {
          model: Book,
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
      offers: recentOffers,
      currentPage: page,
      pageElements: PAGE_ELEMENTS,
      numberOfPages: numberOfPages,
    });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}
async function getBooks(req, res) {}
async function getCategories(req, res) {}
async function searchOffers(req, res) {}

module.exports = { getImage, getRecentOffers };
