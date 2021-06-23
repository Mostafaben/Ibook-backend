const { validationResult } = require('express-validator'),
  {
    handleMiddlewareErrors,
    HttpError,
    HttpErrorHandler,
  } = require('../../utils/error_handlers'),
  { User } = require('./../../models/models'),
  {
    user_role,
    http_response_code: { SUCCESS, NOT_FOUND, UNAUTHORIZED },
  } = require('../../enums/enums'),
  {
    generateAdminToken,
    generateAdminRefreshToken,
  } = require('../../utils/token_handler'),
  { comparePassword } = require('../../utils/passwordsHandler');

async function adminLogin(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(res, errors, 400);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new HttpError('user was not found', NOT_FOUND);

    if (!checkIdentity(user, password))
      throw new HttpError('unauthorized', UNAUTHORIZED);

    const accessToken = generateAdminToken(user.id);
    const refreshToken = generateAdminRefreshToken(user.id);
    user.refresh_token = refreshToken;
    await user.save();

    return res.status(SUCCESS).send({ accessToken, refreshToken });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

function checkIdentity(user, password) {
  return (
    comparePassword(password, user.password) && user.role == user_role.ADMIN
  );
}

async function refreshToken(res, req) {
  try {
    const { refreshToken } = req.body;
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user || user.role != user_role.ADMIN)
      throw new HttpError('unauthorized', UNAUTHORIZED);
    res.status(SUCCESS).send({ accessToken: generateAdminToken(user.id) });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

module.exports = { refreshToken, adminLogin };
