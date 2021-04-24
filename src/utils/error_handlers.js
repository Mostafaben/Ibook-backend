function handleHttpError(res, error, code) {
  return res.status(code).send({
    success: false,
    message: error.message,
  });
}

function handleMiddlewareErrors(res, errors, code) {
  return res.status(code).send({ success: false, errors });
}

module.exports = {
  handleHttpError,
  handleMiddlewareErrors,
};
