const router = require('express').Router();
const authenticationController = require('./controllers/authentication_controller');
const usersController = require('./controllers/users_controller');
const booksController = require('./controllers/books_controller');
const offersControllers = require('./controllers/offers_controller');
const publicController = require('./controllers/public_controller');
const { authenticateUser } = require('./middlewares/authenticate_user');
const interactionsController = require('./controllers/interactions_controller');
const profileController = require('./controllers/profile_controller');

router.use('/auth', authenticationController);
router.use('/users', usersController);
router.use('/books', authenticateUser, booksController);
router.use('/interactions', authenticateUser, interactionsController);
router.use('/profile', authenticateUser, profileController);
router.use('/offers', authenticateUser, offersControllers);
router.use('/public', publicController);

module.exports = router;
