const bcrypt = require('bcrypt');
const SALTS_ROUNDS = 10;

function hashPassword(password) {
  return bcrypt.hashSync(password, SALTS_ROUNDS);
}

function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePassword,
};
