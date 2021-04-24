const {
  User,
  User_Image,
  User_Validation,
  User_Reset_Password,
} = require('./user');
const { Book, Book_Images } = require('./book');
const { Offer_Likes, Offer } = require('./offer');
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
};
