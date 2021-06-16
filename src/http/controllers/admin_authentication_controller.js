const { validationResult } = require('express-validator');
const {
  handleHttpError,
  handleMiddlewareErrors,
} = require('../../utils/error_handlers');
const { User } = require('./../../models/models');
const bcrypt = require('bcrypt');
const { user_role } = require('../../enums/enums');
const {
  generateAdminToken,
  generateAdminRefreshToken,
} = require('../../utils/token_handler');
const {
  hashPassword,
  comparePassword,
} = require('../../utils/passwordsHandler');

async function adminLogin(req, res) {
  try {
    const errros = validationResult(req);
    if (!errros.isEmpty()) return handleMiddlewareErrors(res, errors, 400);
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return handleHttpError(res, new Error('user was not found'), 404);
    }

    if (!checkIdentity(user, password)) {
      return handleHttpError(res, new Error('unautorized'), 403);
    }

    const accessToken = generateAdminToken(user.id);
    const refreshToken = generateAdminRefreshToken(user.id);
    user.refresh_token = refreshToken;
    await user.save();

    return res.status(200).send({ accessToken, refreshToken });
  } catch (error) {
    handleHttpError(res, error, 400);
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
      return handleHttpError(res, new Error('unauthorized'), 403);
    res.status(200).send({ accessToken: generateAdminToken(user.id) });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

module.exports = { refreshToken, adminLogin };
