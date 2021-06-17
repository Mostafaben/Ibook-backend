const path = require('path'),
  fs = require('fs'),
  FILES_PATH = './../../uploads/',
  { HttpErrorHandler, HttpError } = require('./../../utils/error_handlers');

async function getImage(req, res) {
  try {
    const {
      params: { model_name, image_name },
    } = req;
    const fileRelativePath = `${FILES_PATH}/${model_name}/${image_name}`;
    const image_path = path.join(__dirname, fileRelativePath);
    if (!fs.existsSync(image_path))
      throw new HttpError('file does not exist', 404);
    res.status(200).sendFile(image_path);
  } catch (error) {
    HttpErrorHandler(res, new HttpError(error.message, 404));
  }
}

module.exports = { getImage };
