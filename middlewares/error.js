export const errorHandler = (
  res,
  statusCode = 500,
  error = "Internal Server Error"
) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};

export const asyncErrorHandler = (passedFunction) => (req, res) => {
  return Promise.resolve(passedFunction(req, res)).catch((err) => {
    errorHandler(res, 500, err.message);
  });
};
