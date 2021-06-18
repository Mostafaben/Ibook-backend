const router = require('express').Router();
const {
  getImage,
  getRecentOffers,
} = require('../controllers/public_controller');

router.get('/resources/:model_name/:image_name', getImage);
router.get('/offers', getRecentOffers);

module.exports = router;
