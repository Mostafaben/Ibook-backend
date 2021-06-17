const {
    handleHttpError,
    handleMiddlewareErrors,
  } = require('./../../utils/error_handlers'),
  { validationResult, body } = require('express-validator'),
  {
    User,
    User_Validation,
    User_Reset_Password,
  } = require('../../models/models'),
  { hashPassword, comparePassword } = require('./../../utils/passwordsHandler'),
  { respondWithToken, generateToken } = require('../../utils/token_handler'),
  { user_role } = require('../../enums/enums'),
  { sendVerificationMail } = require('../../utils/mailing'),
  randomString = require('randomstring');

async function signUpUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleMiddlewareErrors(res, errors, 400);
    }
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password: hashPassword(password),
    });

    return respondWithToken(user, user_role.USER, res);
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function loginUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleMiddlewareErrors(res, errors, 400);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return handleHttpError(res, new Error('user was not found'), 404);
    if (!comparePassword(password, user.password))
      return handleHttpError(
        res,
        new Error('not valid email or password'),
        404
      );
    return respondWithToken(user, user_role.USER, res);
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function requestVerifyAccount(req, res) {
  try {
    const { id_user } = req.user;
    const code = randomString.generate({ length: 8 });
    const { email, name } = await User.findByPk(id_user);

    // save the code
    await User_Validation.create({ code, UserId: id_user });
    await sendVerificationMail(email, name, code);

    // send the email
    res.status(201).send({ message: 'code has been sent' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function verifyAccount(req, res) {
  try {
    const { code } = req.params;
    const { id_user } = req.user;

    const user_validation = await User_Validation.findOne({
      where: { UserId: id_user, code: code },
    });

    if (!user_validation) {
      return handleHttpError(res, new error('invalid code'), 400);
    }

    const date = new Date();
    date.setHours(date.getHours() - 2);
    if (date > user_validation.createdAt) {
      user_validation.destroy();
      return handleHttpError(res, new Error('code expired'), 400);
    }

    const user = await User.findByPk(id_user);
    user.is_verified = true;
    await user.save();
    await user_validation.destroy();

    return res.status(200).send({ message: 'user is verified' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function refreshUserToken(req, res) {
  try {
    const { refreshToken } = req.body;
    const user = await User.findOne({ where: { refresh_token: refreshToken } });

    if (!user)
      return handleHttpError(res, new Error('user was not found'), 404);

    res.status(200).send({
      token: generateToken(user.id, user_role.USER),
    });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

//
async function logoutUser(req, res) {
  try {
    const { id_user } = req.user;
    const user = await User.findByPk(id_user);
    user.refresh_token = null;
    await user.save();
    res.status(200).send({ message: 'done', success: true });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function requestResetPassword(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(req, errors, 400);

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return handleHttpError(res, new Error('user was not found'), 404);
    const code = cryptoRandomString({ length: 8 });
    await User_Reset_Password.create({
      email,
      code,
    });
    return res.status(201).send({ message: 'check your email' });
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

async function resetUserPassword(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(req, errors, 400);

    const { email, code, password } = req.body;

    const password_reset_request = await User_Reset_Password.findOne({
      where: { code, email },
    });

    if (!password_reset_request)
      return handleHttpError(res, new Error('unvalid code'), 400);

    const date = new Date();
    date.setHours(date.getHours() - 2);
    if (date > password_reset_request.createdAt)
      return handleHttpError(res, new Error('code was expired'), 400);

    const user = await User.findOne({ where: { email } });

    user.password = hashPassword(password);
    await user.save();

    return respondWithToken(user, user_role.USER, res);
  } catch (error) {
    handleHttpError(res, error, 400);
  }
}

module.exports = {
  loginUser,
  signUpUser,
  refreshUserToken,
  requestResetPassword,
  requestVerifyAccount,
  verifyAccount,
  resetUserPassword,
  logoutUser,
};
