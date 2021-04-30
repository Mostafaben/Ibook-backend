const { handleHttpError } = require('./../../utils/error_handlers');
const { User, User_Image } = require('./../../models/models');
const router = require('express').Router();
const pageElements = 10;

router.get('/', async (req, res) => {
  try {
    const { page } = req.query;
    const users = await User.findAll({
      limit: pageElements,
      offset: pageElements * page,
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
    res.status(200).send({ users });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
});

module.exports = router;
