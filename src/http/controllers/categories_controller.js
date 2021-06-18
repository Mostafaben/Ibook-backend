const { category_image_url } = require('../../config/enviroment'),
  isImage = require('is-image'),
  path = require('path'),
  fs = require('fs'),
  { Category, Category_Image } = require('../../models/category'),
  { HttpErrorHandler, HttpError } = require('../../utils/error_handlers'),
  CATEGORIES_ICONS_PATH = './../../uploads/categories/',
  {
    http_reponse_code: { SUCCESS, CREATED },
  } = require('./../../enums/enums');

async function createCategory(req, res) {
  try {
    const {
      body: { name },
      files: { icon },
    } = req;
    const category = await Category.create({ name: name.trim().toLowerCase() });
    let createdIcon;
    if (icon && isImage(icon.path))
      createdIcon = await storeCategoryIcon(name, icon, category.id);
    return res.status(CREATED).send({ category, createdIcon });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function getCategories(_, res) {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Category_Image,
          required: false,
          attributes: ['icon_url', 'id'],
        },
      ],
    });
    res.status(SUCCESS).send({ categories });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function deleteCategoryById(req, res) {
  try {
    const { category } = req;
    await deleteCategoryIcon(category.id);
    await category.destroy();
    res
      .status(SUCCESS)
      .send({ message: 'category was deleted', success: true });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function updateCategoryIcon(req, res) {
  try {
    const {
      files: { icon },
      category,
    } = req;
    if (!icon || !isImage(icon.path)) throw new HttpError('icon is required');
    await deleteCategoryIcon(category.id);
    const updatedCategoryIcon = await storeCategoryIcon(
      category.name,
      icon,
      category.id
    );
    return res.status(SUCCESS).send({ updatedCategoryIcon });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function deleteCategoryIcon(CategoryId) {
  const categoryIcon = await Category_Image.findOne({
    where: { CategoryId },
  });
  if (!categoryIcon) return;
  fs.unlinkSync(categoryIcon.icon_path);
  return categoryIcon.destroy();
}

async function storeCategoryIcon(name, icon, CategoryId) {
  const icon_name =
    name.trim().replace(/ /g, '-') + CategoryId + path.extname(icon.path);
  const icon_path = path.join(__dirname, CATEGORIES_ICONS_PATH + icon_name);
  const icon_url = category_image_url + icon_name;
  fs.renameSync(icon.path, icon_path);
  return Category_Image.create({ icon_name, icon_path, icon_url, CategoryId });
}

module.exports = {
  createCategory,
  getCategories,
  deleteCategoryById,
  updateCategoryIcon,
};
