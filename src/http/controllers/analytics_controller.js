const { Op } = require('sequelize');
const { user_role, offer_type } = require('../../enums/enums');
const { User, Book, Offer } = require('../../models/models');
const { handleHttpError } = require('../../utils/error_handlers');

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
    res.status(200).send({
      usersCount,
      booksCount,
      sellOffersCount,
      exchangeOffersCount,
    });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function getOffersStatistics(req, res) {
  try {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const currentDay = date.getDay();
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function getOffersAnalycis(req, res) {}

module.exports = {
  getBasicAnalycis,
};
