const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { offer_status } = require('../../enums/enums');
const { Offer } = require('../../models/offer');
const {
  handleHttpError,
  handleMiddlewareErrors,
} = require('../../utils/error_handlers');
const {
  createOfferMiddleware,
  isOfferOwner,
} = require('../middlewares/offers_middlewares');

// create offer
router.post('/', createOfferMiddleware, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(res, errors, 400);
    const { id_user } = req.user;
    const { BookId, offer_type } = req.body;
    const offer = await Offer.create({ BookId, offer_type, UserId: id_user });
    return res.status(201).send({ offer });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
});

//delete offer
router.delete('/:id_offer', isOfferOwner, async (req, res) => {
  try {
    await req.offer.destroy();
    return res.status(200).send({ message: 'offer was deleted' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
});

// cancel offer
router.patch('/:id_offer', isOfferOwner, async (req, res) => {
  try {
    req.offer.offer_status = offer_status.CANCELED;
    await offer.save();
    return res.status(200).send({ offer });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
});

module.exports = router;
