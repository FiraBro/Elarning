// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  console.error("ERROR 💥:", err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "Something went wrong!",
  });
};

module.exports = globalErrorHandler;
