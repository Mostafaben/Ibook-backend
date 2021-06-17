const { Book, Book_Images } = require('./book'),
  {
    User,
    User_Image,
    User_Validation,
    User_Reset_Password,
  } = require('./user'),
  {
    Offer_Likes,
    Offer,
    Offer_Sell_Respond,
    Offer_Exchange_Respond,
  } = require('./offer'),
  { Wilaya, Address } = require('./address'),
  { Author } = require('./author'),
  { Category, Category_Image } = require('./category');

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
  Author,
  Category,
  Category_Image,
};
