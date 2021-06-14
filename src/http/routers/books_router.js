const {
  deleteBookById,
  updateBook,
  updateBookCover,
  createBook,
  getUserBooks,
} = require('../controllers/books_controller');
const {
  isOwner,
  createBookMiddleware,
} = require('./../middlewares/book_middlewares');
const router = require('express').Router();

router.delete('/:id_book', isOwner, deleteBookById);
router.patch('/:id_book', isOwner, updateBook);
router.patch('/cover/:id_book', isOwner, updateBookCover);
router.post('/', createBookMiddleware, createBook);
router.get('/', getUserBooks);

module.exports = router;
