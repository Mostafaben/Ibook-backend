const router = require('express').Router();
const {
  updateUserAddress,
  updateUserProfileImage,
} = require('../controllers/profile_controller');
const {
  updateAddressMiddleware,
} = require('../middlewares/profile_middlewares');

router.patch('/profile_image', updateUserProfileImage);
router.patch('/address', updateAddressMiddleware, updateUserAddress);

module.exports = router;
