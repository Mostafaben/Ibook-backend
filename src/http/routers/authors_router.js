const {
  createAuthor,
  getAuthors,
  getAuthorsNames,
  addAuthorImage,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/authors_controller');
const {
  createAuthorMiddleware,
  authorExistsMiddleware,
} = require('../middlewares/authors_middlewares');
const router = require('express').Router();

router.post('/', createAuthorMiddleware, createAuthor);
router.get('/', getAuthors);
router.delete('/:id_author', authorExistsMiddleware, deleteAuthor);
router.patch('/:id_author', authorExistsMiddleware, updateAuthor);
router.patch('/:id_author/image', authorExistsMiddleware, addAuthorImage);
router.get('/names', getAuthorsNames);

module.exports = router;
