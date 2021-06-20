const { Op, DatabaseError } = require('sequelize');
const {
  user_role,
  offer_type,
  http_reponse_code: { SUCCESS },
} = require('../../enums/enums');
const { User, Book, Offer } = require('../../models/models');
const { HttpErrorHandler } = require('../../utils/error_handlers');

async function getBasicAnalycis(req, res) {
  try {
    const usersCount = await User.count({
      where: { role: { [Op.ne]: user_role.ADMIN } },
    });
    const booksCount = await Book.count();
    const sellOffersCount = await Offer.count({
      where: { offer_type: offer_type.SELL },
    });
    const exchangeOffersCount = await Offer.count({
      where: { offer_type: offer_type.EXCHANGE },
    });

    res.status(SUCCESS).send({
      usersCount,
      booksCount,
      offersCount: sellOffersCount + exchangeOffersCount,
      sellOffersCount,
      exchangeOffersCount,
    });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function getOffersStatistics(req, res) {
  try {
    const date = new Date();

    const {
      query: { month = date.getMonth() + 1 },
    } = req;

    date.setMonth(month);
    const currentYear = date.getFullYear();
    const numberOfDays = getMonthDays(month, currentYear);
    const offersAnalycis = [];

    for (let i = 0; i < numberOfDays - 1; i++) {
      const currentDate = date.setDate(i);
      const nextDate = date.setDate(i + 1);
      const sellOffersCount = await Offer.count({
        where: {
          offer_type: offer_type.SELL,
          createdAt: {
            [Op.gte]: currentDate,
            [Op.lt]: nextDate,
          },
        },
      });
      const exchangeOffersCount = await Offer.count({
        where: {
          offer_type: offer_type.EXCHANGE,
          createdAt: {
            [Op.gte]: currentDate,
            [Op.lt]: nextDate,
          },
        },
      });
      offersAnalycis.push({
        offersCount: exchangeOffersCount + sellOffersCount,
        exchangeOffersCount,
        sellOffersCount,
        date: new Date(nextDate),
      });
    }
    res.status(SUCCESS).send(offersAnalycis);
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

function getMonthDays(month, year) {
  return new Date(month, year, 0).getDate();
}

async function getUserInteractionsAnalycis(req, res) {
  try {
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function getLikesCountByDay(day, month) {}

async function getOffersCountByDay(day, month) {}

async function getBooksCreationByDay(day, month) {}

module.exports = {
  getBasicAnalycis,
  getOffersStatistics,
  getUserInteractionsAnalycis,
};
