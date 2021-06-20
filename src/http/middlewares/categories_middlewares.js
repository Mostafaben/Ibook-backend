const {
  http_reponse_code: { NOT_FOUND },
} = require('../../enums/enums');
const { Category } = require('../../models/models');
const { HttpErrorHandler, HttpError } = require('../../utils/error_handlers');

async function checkIfCategoryExists(req, res, next) {
  try {
    const {
      params: { id_category },
    } = req;
    const category = await Category.findByPk(id_category);
    if (!category) throw new HttpError('category does not exist', NOT_FOUND);
    req.category = category;
    next();
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

module.exports = { checkIfCategoryExists };
