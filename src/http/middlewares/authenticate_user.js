const { handleHttpError } = require('../../utils/error_handlers');
const { token_secret } = require('./../../config/enviroment');
const jwt = require('jsonwebtoken');
const { user_role } = require('../../enums/enums');

function authenticateUser(req, res, next) {
  try {
    let token = req.headers.authorization?.split(' ')[1];

    jwt.verify(token, token_secret, (error, user) => {
      if (error) return handleHttpError(res, error, 401);
      req.user = user;
      next();
    });
  } catch (error) {
    handleHttpError(res, error, 401);
  }
}

function authenticateAdmin(req, res, next) {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    jwt.verify(token, token_secret, (error, user) => {
      if (error) return handleHttpError(res, error, 401);
      if (user.role != user_role.ADMIN)
        return handleHttpError(res, new Error('forbbidan'), 403);
      req.user = user;
      next();
    });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}
module.exports = { authenticateUser, authenticateAdmin };
