const router = require('express').Router();
const {
  getOffersStatistics,
  getBasicAnalycis,
  getUserInteractionsAnalycis,
} = require('../controllers/analytics_controller');

router.get('/offers', getOffersStatistics);
router.get('/basic', getBasicAnalycis);
router.get('/users', getUserInteractionsAnalycis);

module.exports = router;
