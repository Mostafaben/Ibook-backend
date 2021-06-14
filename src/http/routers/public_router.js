const router = require('express').Router();
const {
  getBookImage,
  getUserImage,
} = require('../controllers/public_controller');

router.get('/books/:image_name', getBookImage);
router.get('/user/:image_name', getUserImage);

module.exports = router;
