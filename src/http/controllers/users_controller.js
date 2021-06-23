const { HttpErrorHandler, HttpError } = require('./../../utils/error_handlers');
const {
  User,
  User_Image,
  Book_Images,
  Offer,
  Book,
} = require('./../../models/models');
const { Op, Sequelize } = require('sequelize');
const {
  user_role,
  http_response_code: { SUCCESS, NOT_FOUND },
} = require('../../enums/enums');
const PAGE_ELEMENTS = 10;

async function getUsers(req, res) {
  try {
    let { page } = req.query;
    if (!page) page = 0;

    const usersCount = await User.count({
      where: { role: { [Op.ne]: user_role.ADMIN } },
    });
    const pagesCount = Math.ceil(usersCount / PAGE_ELEMENTS);
    const users = await User.findAll({
      where: { role: { [Op.ne]: user_role.ADMIN } },
      limit: PAGE_ELEMENTS,
      offset: PAGE_ELEMENTS * page,
      attributes: [
        'name',
        'email',
        'createdAt',
        'updatedAt',
        'is_verified',
        [
          Sequelize.literal(
            'select count(*) from books where books.UserId == users.id'
          ),
          'booksCount',
        ],
        [
          Sequelize.literal(
            'select count(*) from offers where offers.UserId == users.id'
          ),
          'offersCount',
        ],
      ],
      include: [
        {
          model: User_Image,
          required: false,
          limit: 1,
          attributes: ['image_url'],
        },
        {
          model: Book,
          attributes: [],
        },
        {
          model: Offer,
          attributes: [],
        },
      ],
    });
    res.status(SUCCESS).send({
      users,
      pageElements: PAGE_ELEMENTS,
      currentPage: page,
      pagesCount,
    });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function getUserInformations(req, res) {
  try {
    const { id_user } = req.params;
    const user = await User.findByPk(id_user, {
      attributes: [
        'name',
        'email',
        'is_verified',
        'role',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Book,
          required: false,
          attributes: [],
          include: [
            { model: Book_Images, required: false, attributes: ['image_url'] },
          ],
        },
        { model: User_Image, required: false, attributes: ['image_url'] },
        {
          model: Offer,
          required: false,
          include: [{ model: Book, required: false }],
        },
      ],
    });
    if (!user) throw new HttpError('user was not found', NOT_FOUND);
    res.status(SUCCESS).send({ user });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

module.exports = {
  getUserInformations,
  getUsers,
};
