const { HttpErrorHandler, HttpError } = require('../../utils/error_handlers');
const { token_secret } = require('./../../config/enviroment');
const jwt = require('jsonwebtoken');
const { user_role } = require('../../enums/enums');

function authenticateUser(req, res, next) {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    jwt.verify(token, token_secret, (error, user) => {
      if (error) throw new HttpError(error.message, 401);
      req.user = user;
      next();
    });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

function authenticateAdmin(req, res, next) {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    jwt.verify(token, token_secret, (error, user) => {
      if (error) throw new HttpError(error.message, 401);
      if (user.role != user_role.ADMIN) throw new HttpError('forbbidan', 403);
      req.user = user;
      next();
    });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}
module.exports = { authenticateUser, authenticateAdmin };
