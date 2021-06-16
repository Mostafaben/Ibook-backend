class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}
function handleHttpError(res, error, code) {
  return res.status(code).send({
    success: false,
    message: error.message,
  });
}

function handleMiddlewareErrors(res, errors, code) {
  return res.status(code).send({ success: false, ...errors });
}

function HttpErrorHandler(res, error) {
  const { code, message } = error;
  code ? code : (code = 400);
  return res.status(code).send({ success: false, message: message });
}

module.exports = {
  handleHttpError,
  handleMiddlewareErrors,
  HttpErrorHandler,
  HttpError,
};
