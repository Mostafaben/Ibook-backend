const {
  Book,
  Book_Images,
  User,
  User_Validation,
  User_Image,
  Address,
  Wilaya,
  Offer,
  Offer_Likes,
  Offer_Exchange_Respond,
  Offer_Sell_Respond,
  User_Reset_Password,
  Author,
} = require('./models');

// book associations
Book.hasMany(Book_Images);
Book.belongsTo(User);
Author.hasMany(Book);
Book.belongsTo(Author);
// user associations
User_Validation.belongsTo(User);
User_Image.belongsTo(User);
User.hasMany(User_Image);
User_Reset_Password.belongsTo(User);

// address associations
Wilaya.hasMany(Address);
Address.belongsTo(User);

// offer associations
Offer.belongsTo(Book);
Offer.hasMany(Offer_Likes);
Offer_Likes.belongsTo(User);
Offer.hasMany(Offer_Sell_Respond);
Offer.hasMany(Offer_Exchange_Respond);
Offer_Exchange_Respond.belongsTo(Book);
Offer_Exchange_Respond.belongsTo(User);
Offer_Sell_Respond.belongsTo(User);
Offer.belongsTo(User);
