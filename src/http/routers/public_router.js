const router = require("express").Router()
const {
  getImage,
  getRecentOffers,
  getAuthors,
  getCategories,
  getOfferLikes,
  getOfferResponds,
} = require("../controllers/public_controller")
const { OfferExists } = require("./../middlewares/offers_middlewares")

router.get("/resources/:model_name/:image_name", getImage)
router.get("/offers", getRecentOffers)
router.get("/authors", getAuthors)
router.get("/categories", getCategories)
router.get("/:id_offer/likes", OfferExists, getOfferLikes)
router.get("/:id_offer/responds", OfferExists, getOfferResponds)

module.exports = router
