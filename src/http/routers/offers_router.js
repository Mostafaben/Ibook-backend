const router = require('express').Router();
const {
  getOffers,
  createOffer,
  deleteOffer,
  cancelOffer,
} = require('../controllers/offers_controller');
const {
  createOfferMiddleware,
  isOfferOwner,
} = require('../middlewares/offers_middlewares');

router.get('/', getOffers);
router.post('/', createOfferMiddleware, createOffer);
router.delete('/:id_offer', isOfferOwner, deleteOffer);
router.patch('/:id_offer', isOfferOwner, cancelOffer);

module.exports = router;
