const { validationResult } = require('express-validator');
const {
  handleHttpError,
  handleMiddlewareErrors,
} = require('../../utils/error_handlers');
const { User } = require('./../../models/models');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const { user_role } = require('../../enums/enums');
const { generateAdminToken } = require('../../utils/token_handler');
const {
  authenticationAdminLoginMiddleware,
} = require('../middlewares/authentication_middlewares');

router.post('/', authenticationAdminLoginMiddleware, async (req, res) => {
  try {
    const errros = validationResult(req);
    if (!errros.isEmpty()) return handleMiddlewareErrors(res, errors, 400);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return handleHttpError(res, new Error('user was not found'), 404);
    }
    if (
      !bcrypt.compareSync(password, user.password) ||
      user.role != user_role.ADMIN
    ) {
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
});

module.exports = router;
