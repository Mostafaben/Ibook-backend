const { Book, Book_Images } = require('./book');

const {
  User,
  User_Image,
  User_Validation,
  User_Reset_Password,
} = require('./user');

const {
  Offer_Likes,
  Offer,
  Offer_Sell_Respond,
  Offer_Exchange_Respond,
} = require('./offer');

const { Wilaya, Address } = require('./address');

module.exports = {
  User,
  Book,
  Book_Images,
  Offer,
  Offer_Likes,
  Wilaya,
  Address,
  User_Image,
  User_Validation,
  User_Reset_Password,
  Offer_Exchange_Respond,
  Offer_Sell_Respond,
};
