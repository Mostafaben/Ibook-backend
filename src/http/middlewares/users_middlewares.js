const {
  http_response_code: { NOT_FOUND },
} = require('../../enums/enums');
const { User } = require('../../models/models');
const { HttpErrorHandler, HttpError } = require('../../utils/error_handlers');

async function UserExists(req, res) {
  try {
    const {
      params: { id_user },
    } = req;
    const user = await User.findByPk(id_user);
    if (!user) throw new HttpError('user not found', NOT_FOUND);
  } catch (error) {
    HttpErrorHandler(res, error);
  }
}

module.exports = {
  UserExists,
};
