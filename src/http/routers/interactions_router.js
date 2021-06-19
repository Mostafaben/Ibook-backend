const router = require('express').Router();
const {
  likeOffer,
  respondToSellOffer,
  respondToExchangeOffer,
  deleteOfferRespondById,
} = require('../controllers/interactions_controller');
const {
  respondExistsMiddleware,
  isRespondOwnerMiddleware,
  createExchangeRespondsMiddleware,
} = require('./../middlewares/interactions_middlewares');

const { OfferExists } = require('../middlewares/offers_middlewares');

router.get('/:id_offer', OfferExists, likeOffer);
router.post('/:id_offer/sell', OfferExists, respondToSellOffer);
router.post(
  '/:id_offer/exchange',
  createExchangeRespondsMiddleware,
  OfferExists,
  respondToExchangeOffer
);
router.delete(
  '/:id_respond',
  respondExistsMiddleware,
  isRespondOwnerMiddleware,
  deleteOfferRespondById
);

module.exports = router;
