const router = require('express').Router();
const {
  likeOffer,
  respondToSellOffer,
  respondToExchangeOffer,
  deleteSellRespondById,
  deleteExchangeRespondById,
} = require('../controllers/interactions_controller');

router.get('/:id_offer', likeOffer);
router.post('/:id_offer/sell', respondToSellOffer);
router.post('/:id_offer/exchange', respondToExchangeOffer);
router.delete('/sell/:id_respond', deleteSellRespondById);
router.delete('/exchange/:id_respond', deleteExchangeRespondById);

module.exports = router;
