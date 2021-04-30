const jwt = require('jsonwebtoken');
const {
  token_durration,
  token_secret,
  refresh_token_secret,
} = require('./../config/enviroment');
const { User } = require('./../models/models');

const respondWithToken = async (user, role, res) => {
  const id_user = user.id;
  const accessToken = generateToken(id_user, role);
  const expiresAt = parseInt(token_durration);
  const refreshToken = await generateRefreshToken(user, role);

  if (!refreshToken)
    return handleHttpError(new Error('error creating refresh token', res, 500));

  return res.status(200).send({
    data: {
      refreshToken: refreshToken,
      accessToken: accessToken,
      expiresAt: expiresAt,
    },
  });
};

const generateRefreshToken = async (user, role) => {
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
};

const generateToken = (id_user, role) => {
  const tokenDuration = parseInt(token_durration);
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
};

function generateAdminToken(id_user) {
  return jwt.sign(
    { id_user, role: user_role.ADMIN, expiresIn: token_durration },
    token_secret,
    {
      expiresIn: token_durration,
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
