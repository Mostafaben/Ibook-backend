const router = require('express').Router();

const authenticationRouter = require('./routers/admin_authentication_router');
const usersRouter = require('./routers/users_router');
const booksRouter = require('./routers/books_router');
const offersRouter = require('./routers/offers_router');
const publicRouter = require('./routers/public_router');
const {
  authenticateUser,
  authenticateAdmin,
} = require('./middlewares/authenticate_user');
const interactionsRouter = require('./routers/interactions_router');
const profileRouter = require('./routers/profile_router');

router.use('/auth', authenticationRouter);
router.use('/users', authenticateAdmin, usersRouter);
router.use('/profile', authenticateUser, profileRouter);
router.use('/offers', authenticateUser, offersRouter);
router.use('/books', authenticateUser, booksRouter);
router.use('/interactions', authenticateUser, interactionsRouter);
router.use('/public', publicRouter);

module.exports = router;
