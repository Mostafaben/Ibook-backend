const { Category_Image, Book_Category } = require('./category'),
  {
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
    Category,
  } = require('./models');

// book associations
Book.images = Book.hasMany(Book_Images);
Book_Images.book = Book_Images.belongsTo(Book);
Book.user = Book.belongsTo(User);
Author.book = Author.hasMany(Book);
Book.author = Book.belongsTo(Author);
Book.categories = Book.belongsToMany(Category, { through: Book_Category });
Category.books = Category.belongsToMany(Book, { through: Book_Category });
Category.image = Category.hasOne(Category_Image);
Category_Image.category = Category_Image.belongsTo(Category);
Book.echange_responds = Book.hasMany(Offer_Exchange_Respond);

// offer associations
Offer.book = Offer.belongsTo(Book);
Offer.likes = Offer.hasMany(Offer_Likes);
Offer.sell_responds = Offer.hasMany(Offer_Sell_Respond);
Offer.echange_responds = Offer.hasMany(Offer_Exchange_Respond);
Offer.users = Offer.belongsTo(User);
Offer_Sell_Respond.user = Offer_Sell_Respond.belongsTo(User);
Offer_Exchange_Respond.user = Offer_Exchange_Respond.belongsTo(User);
Offer_Exchange_Respond.book = Offer_Exchange_Respond.belongsTo(Book);
Offer_Likes.user = Offer_Likes.belongsTo(User);

// user associations
User_Validation.belongsTo(User);
User_Image.belongsTo(User);
User.hasMany(User_Image);
User_Reset_Password.belongsTo(User);

// address associations
Wilaya.hasMany(Address);
Address.user = Address.belongsTo(User);
