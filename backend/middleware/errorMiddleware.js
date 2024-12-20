const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  console.error(err);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "dev" ? err.stack : null,
  });
};

module.exports = errorHandler;
