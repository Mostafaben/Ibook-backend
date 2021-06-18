const { HttpErrorHandler, HttpError } = require('../../utils/error_handlers'),
  { token_secret } = require('./../../config/enviroment'),
  jwt = require('jsonwebtoken'),
  {
    user_role,
    http_reponse_code: { UNAUTHORIZED, FORBIDDEN },
  } = require('../../enums/enums');

function authenticateUser(req, res, next) {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    jwt.verify(token, token_secret, (error, user) => {
      if (error) throw new HttpError(error.message, UNAUTHORIZED);
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
      if (error) throw new HttpError(error.message);
      if (user.role != user_role.ADMIN)
        throw new HttpError('forbbidan', FORBIDDEN);
      req.user = user;
      next();
    });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}
module.exports = { authenticateUser, authenticateAdmin };
