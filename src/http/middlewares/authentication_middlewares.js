const { body } = require('express-validator');

const inscriptionMiddleware = [
  body('name').isLength({ min: 4, max: 30 }),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('password_confirmation').custom((value, { req }) => {
    const { password } = req.body;
    if (value != password)
      throw new Error('password confirmation is not match');

    return true;
  }),
];

const loginMiddleware = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
];

const resetPassowrdRequestMiddleware = [body('email').isEmail()];
const resetPasswordMiddleware = [
  body('email').isEmail(),
  body('password').notEmpty().isLength({ min: 8 }),
  body('password_confirmation').custom((value, { req }) => {
    if (value != req.body.password)
      throw new Error('password and password confirmation does not much');
    return true;
  }),
  body('code').isLength({ min: 8, max: 8 }),
];

module.exports = {
  inscriptionMiddleware,
  loginMiddleware,
  resetPassowrdRequestMiddleware,
  resetPasswordMiddleware,
};
