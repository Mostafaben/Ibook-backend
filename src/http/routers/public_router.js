const router = require('express').Router();
const {
  getBookImage,
  getUserImage,
  getAuthorImage,
} = require('../controllers/public_controller');

router.get('/books/:image_name', getBookImage);
router.get('/user/:image_name', getUserImage);
router.get('/authors/:image_name', getAuthorImage);

module.exports = router;
