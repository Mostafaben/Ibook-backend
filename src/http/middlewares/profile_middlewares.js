const { body } = require('express-validator');

const updateAddressMiddleware = [
  body('address').notEmpty(),
  body('id_wilaya').isNumeric(),
];

module.exports = { updateAddressMiddleware };
