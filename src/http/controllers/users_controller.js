const { handleHttpError } = require('./../../utils/error_handlers');
const {
  User,
  User_Image,
  Book_Images,
  Offer,
  Book,
} = require('./../../models/models');
const PAGE_ELEMENTS = 10;

async function getUsers(req, res) {
  try {
    const { page } = req.query;

    const users = await User.findAll({
      limit: PAGE_ELEMENTS,
      offset: PAGE_ELEMENTS * page,
      attributes: ['name', 'email', 'createdAt', 'updatedAt', 'is_verified'],
      include: [
        {
          model: User_Image,
          required: false,
          limit: 1,
          attributes: ['image_url'],
        },
      ],
    });
    res.status(200).send({ users, PAGE_ELEMENTS, page });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function getUserInformations(req, res) {
  try {
    const { id_user } = req.params;
    const user = await User.findByPk(id_user, {
      include: [
        {
          model: Book,
          required: false,
          attributes: [
            'name',
            'email',
            'is_verified',
            'role',
            'createdAt',
            'updatedAt',
          ],
          include: [
            { model: Book_Images, required: false, attributes: ['image_url'] },
            { model: User_Image, required: false, attributes: ['image_url'] },
            {
              model: Offer,
              required: false,
              include: [{ model: Book, required: false }],
            },
          ],
        },
      ],
    });

    if (!user)
      return handleHttpError(res, new Error('user was not found'), 404);
    res.status(200).send({ user });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

module.exports = {
  getUserInformations,
  getUsers,
};
