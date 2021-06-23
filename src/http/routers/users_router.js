const { UserExists } = require('../middlewares/users_middlewares');

const router = require('express').Router(),
  {
    getUsers,
    getUserInformations,
  } = require('../controllers/users_controller');

router.get('/', getUsers);
router.get('/:id_user', UserExists, getUserInformations);

module.exports = router;
