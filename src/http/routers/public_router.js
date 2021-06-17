const router = require('express').Router();
const { getImage } = require('../controllers/public_controller');

router.get('/:model_name/:image_name', getImage);

module.exports = router;
