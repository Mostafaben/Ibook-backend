const jwt = require('jsonwebtoken');
const {
  token_duration,
  token_secret,
  refresh_token_secret,
} = require('./../config/enviroment');

const {
  user_role,
  http_response_code: { SUCCESS, INTERNAL_ERROR },
} = require('../enums/enums');
const { HttpError } = require('./error_handlers');

async function respondWithToken(user, role, res) {
  const id_user = user.id;
  const accessToken = generateToken(id_user, role);
  const expiresAt = parseInt(token_duration);
  const refreshToken = await generateRefreshToken(user, role);

  if (!refreshToken)
    throw new HttpError('error creating refresh token', INTERNAL_ERROR);

  return res.status(SUCCESS).send({
    data: {
      refreshToken: refreshToken,
      accessToken: accessToken,
      expiresAt: expiresAt,
    },
  });
}

async function generateRefreshToken(user, role) {
  const refreshToken = jwt.sign(
    {
      id_user: user.id,
      role: role,
    },
    refresh_token_secret
  );
  user.refresh_token = refreshToken;
  await user.save({ fields: ['refresh_token'] });

  return refreshToken;
}

function generateToken(id_user, role) {
  const tokenDuration = parseInt(token_duration);
  return jwt.sign(
    {
      id_user: id_user,
      role: role,
    },
    token_secret,
    {
      expiresIn: `${tokenDuration}s`,
    }
  );
}

function generateAdminToken(id_user) {
  return jwt.sign(
    { id_user, role: user_role.ADMIN, expiresIn: token_duration },
    token_secret,
    {
      expiresIn: `${token_duration}s`,
    }
  );
}

function generateAdminRefreshToken(id_user) {
  return jwt.sign({ id_user, role: user_role.ADMIN }, refresh_token_secret);
}

module.exports = {
  respondWithToken,
  generateRefreshToken,
  generateAdminRefreshToken,
  generateAdminToken,
  generateToken,
};
