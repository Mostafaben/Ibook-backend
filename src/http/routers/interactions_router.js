const router = require('express').Router();
const { Offer } = require('../../models/offer');
const { handleHttpError } = require('../../utils/error_handlers');
const {
  likeOffer,
  respondToSellOffer,
  respondToExchangeOffer,
  deleteOfferRespondById,
} = require('../controllers/interactions_controller');
const {
  offerExistsMiddleware,
  respondExistsMiddleware,
} = require('../middlewares/interactions_middlewares');

router.get('/:id_offer', offerExistsMiddleware, likeOffer);
router.post('/:id_offer/sell', offerExistsMiddleware, respondToSellOffer);
router.delete('/:id_respond', respondExistsMiddleware, deleteOfferRespondById);
router.post(
  '/:id_offer/exchange',
  offerExistsMiddleware,
  respondToExchangeOffer
);

module.exports = router;
