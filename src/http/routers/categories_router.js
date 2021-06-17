const {
  createCategory,
  getCategories,
  deleteCategoryById,
  updateCategoryIcon,
} = require('../controllers/categories_controller');
const {
  checkIfCategoryExists,
} = require('../middlewares/categories_middlewares');
const router = require('express').Router();

router.post('/', createCategory);
router.get('/', getCategories);
router.delete('/:id_category', checkIfCategoryExists, deleteCategoryById);
router.patch('/:id_category/icon', checkIfCategoryExists, updateCategoryIcon);

module.exports = router;
