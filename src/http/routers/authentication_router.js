const router = require('express').Router();

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

router.post('/sign_up', inscriptionMiddleware, signUpUser);
router.post('/login', loginMiddleware, loginUser);
router.get('/verify_account_request', requestVerifyAccount);
router.get('/verify_account/:code', verifyAccount);
router.post('/refresh_token', refreshUserToken);
router.patch('/logout', logoutUser);
router.post(
  '/reset_password_request',
  resetPassowrdRequestMiddleware,
  requestResetPassword
);
router.post('/reset_passwod', resetPasswordMiddleware, resetUserPassword);

module.exports = router;
