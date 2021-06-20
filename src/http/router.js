const router = require('express').Router(),
  adminAuthenticationRouter = require('./routers/admin_authentication_router'),
  authenticationRouter = require('./routers/authentication_router'),
  usersRouter = require('./routers/users_router'),
  booksRouter = require('./routers/books_router'),
  offersRouter = require('./routers/offers_router'),
  publicRouter = require('./routers/public_router'),
  interactionsRouter = require('./routers/interactions_router'),
  profileRouter = require('./routers/profile_router'),
  authorsRouter = require('./routers/authors_router'),
  categoriesRouter = require('./routers/categories_router'),
  analycisRouter = require('./routers/analycis_router'),
  {
    authenticateUser,
    authenticateAdmin,
  } = require('./middlewares/authenticate_user');

router.use('/auth/admin', adminAuthenticationRouter);
router.use('/auth/user', authenticationRouter);
router.use('/users', authenticateAdmin, usersRouter);
router.use('/analycis', authenticateAdmin, analycisRouter);
router.use('/author', authenticateAdmin, authorsRouter);
router.use('/profile', authenticateUser, profileRouter);
router.use('/offers', authenticateUser, offersRouter);
router.use('/books', authenticateUser, booksRouter);
router.use('/interactions', authenticateUser, interactionsRouter);
router.use('/categories', authenticateAdmin, categoriesRouter);
router.use('/public', publicRouter);

module.exports = router;
