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
  isBookOwner,
} = require('./../middlewares/book_middlewares');
const router = require('express').Router();

router.get('/', getUserBooks);
router.post('/', createBookMiddleware, createBook);
router.delete('/:id_book', isOwner, deleteBookById);
router.patch('/:id_book', isOwner, updateBook);
router.post('/:id_book/image', isOwner, addBookImage);
router.patch('/:id_book/cover', isOwner, updateBookCover);
router.delete('/image/:id_image', isBookOwner, deleteBookImage);

module.exports = router;
