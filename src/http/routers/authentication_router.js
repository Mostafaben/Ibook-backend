const router = require('express').Router();
const { get, patch, post } = router;
const {
  loginUser,
  signUpUser,
  requestVerifyAccount,
  verifyAccount,
  refreshUserToken,
  logoutUser,
  requestResetPassword,
  resetUserPassword,
} = require('./../controllers/authentication_controller');
const {
  inscriptionMiddleware,
  loginMiddleware,
  resetPassowrdRequestMiddleware,
  resetPasswordMiddleware,
} = require('../middlewares/authentication_middlewares');

post('/sign_up', inscriptionMiddleware, signUpUser);
post('/login', loginMiddleware, loginUser);
get('/verify_account_request', requestVerifyAccount);
get('/verify_account/:code', verifyAccount);
post('/refresh_token', refreshUserToken);
patch('/logout', logoutUser);
post(
  '/reset_password_request',
  resetPassowrdRequestMiddleware,
  requestResetPassword
);
post('/reset_passwod', resetPasswordMiddleware, resetUserPassword);

module.exports = router;
