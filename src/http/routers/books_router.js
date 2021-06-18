const {
  deleteBookById,
  updateBook,
  updateBookCover,
  createBook,
  getUserBooks,
  deleteBookImage,
  addBookImage,
} = require('../controllers/books_controller');
const {
  isOwner,
  createBookMiddleware,
  bookExists,
  isImageBelongsToBook,
} = require('./../middlewares/book_middlewares');
const router = require('express').Router();

router.get('/', getUserBooks);
router.post('/', createBookMiddleware, createBook);
router.delete('/:id_book', bookExists, isOwner, deleteBookById);
router.patch('/:id_book', bookExists, isOwner, updateBook);
router.post('/:id_book/image', bookExists, isOwner, addBookImage);
router.patch('/:id_book/cover', bookExists, isOwner, updateBookCover);
router.delete(
  '/:id_book/image/:id_image',
  bookExists,
  isOwner,
  isImageBelongsToBook,
  deleteBookImage
);

module.exports = router;
