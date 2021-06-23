const {
    HttpErrorHandler,
    handleMiddlewareErrors,
    HttpError,
  } = require('./../../utils/error_handlers'),
  { validationResult, body } = require('express-validator'),
  {
    User,
    User_Validation,
    User_Reset_Password,
  } = require('../../models/models'),
  { hashPassword, comparePassword } = require('./../../utils/passwordsHandler'),
  { respondWithToken, generateToken } = require('../../utils/token_handler'),
  {
    user_role,
    http_response_code: { SUCCESS, NOT_FOUND, CREATED },
  } = require('../../enums/enums'),
  { sendVerificationMail } = require('../../utils/mailing'),
  randomString = require('randomstring');

async function signUpUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleMiddlewareErrors(res, errors);
    }
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password: hashPassword(password),
    });

    return respondWithToken(user, user_role.USER, res);
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function loginUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return handleMiddlewareErrors(res, errors);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) throw new HttpError('user was not found', NOT_FOUND);

    if (!comparePassword(password, user.password))
      throw new HttpError('not valid email or password', NOT_FOUND);

    return respondWithToken(user, user_role.USER, res);
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function requestVerifyAccount(req, res) {
  try {
    const { id_user } = req.user;
    const code = randomString.generate({ length: 8 });
    const { email, name } = await User.findByPk(id_user);
    await User_Validation.create({ code, UserId: id_user });
    await sendVerificationMail(email, name, code);
    res.status(CREATED).send({ message: 'code has been sent' });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function verifyAccount(req, res) {
  try {
    const {
      params: { code },
      user: { id_user },
    } = req;

    const userValidation = await User_Validation.findOne({
      where: { UserId: id_user, code },
    });
    if (!userValidation) throw new HttpError('invalid code');

    const date = new Date();
    date.setHours(date.getHours() - 2);
    if (date > userValidation.createdAt) {
      userValidation.destroy();
      throw new HttpError('code expired');
    }
    const user = await User.findByPk(id_user);
    user.is_verified = true;
    await user.save();
    await userValidation.destroy();

    return res.status(SUCCESS).send({ message: 'user is verified' });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function refreshUserToken(req, res) {
  try {
    const { refreshToken } = req.body;
    const user = await User.findOne({ where: { refresh_token: refreshToken } });
    if (!user) throw new HttpError('user was not found', NOT_FOUND);
    res.status(SUCCESS).send({
      token: generateToken(user.id, user_role.USER),
    });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function logoutUser(req, res) {
  try {
    const { id_user } = req.user;
    const user = await User.findByPk(id_user);
    user.refresh_token = null;
    await user.save();
    res.status(SUCCESS).send({ message: 'done', success: true });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function requestResetPassword(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(res, errors);

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) throw new HttpError('user was not found', NOT_FOUND);
    const code = cryptoRandomString({ length: 8 });
    await User_Reset_Password.create({
      email,
      code,
    });
    return res.status(CREATED).send({ message: 'check your email' });
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

async function resetUserPassword(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return handleMiddlewareErrors(req, errors);
    const { email, code, password } = req.body;
    const resetPasswordRequest = await User_Reset_Password.findOne({
      where: { code, email },
    });
    if (!resetPasswordRequest) throw new HttpError('invalid code');
    const date = new Date();
    date.setHours(date.getHours() - 2);
    if (date > resetPasswordRequest.createdAt)
      throw new HttpError('code expired');
    const user = await User.findOne({ where: { email } });
    user.password = hashPassword(password);
    await user.save();
    return respondWithToken(user, user_role.USER, res);
  } catch (error) {
    HttpErrorHandler(res, error);
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
