const router = require('express').Router();
const {
  getUsers,
  getUserInformations,
} = require('../controllers/users_controller');

router.get('/', getUsers);
router.get('/:id_user', getUserInformations);

module.exports = router;
