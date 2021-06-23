const {
  http_response_code: { BAD_REQUEST },
} = require('./../enums/enums');

class HttpError extends Error {
  constructor(message, code = BAD_REQUEST) {
    super(message);
    this.code = code;
  }
}

function handleMiddlewareErrors(res, errors, code = BAD_REQUEST) {
  return res.status(code).send({ success: false, ...errors });
}

function HttpErrorHandler(res, error) {
  let { code, message } = error;
  if (!code) code = BAD_REQUEST;
  return res
    .status(code)
    .send({ success: false, message: message, stack: error.stack });
}

module.exports = {
  handleMiddlewareErrors,
  HttpErrorHandler,
  HttpError,
};
