import createHttpError from "http-errors";


// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err); // Log error for debugging

  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";
  let details = [];

  // Handle Joi Validation Errors
  if (err.details && Array.isArray(err.details)) {
    statusCode = 400;
    message = "Validation Error";
    details = err.details.map((detail) => detail.message);
  }

  // Handle MongoDB Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Invalid input data";
    details = Object.values(err.errors).map((el) => el.message);
  }

  // Handle CastErrors (e.g., invalid ObjectId format)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    details = [`Invalid value for ${err.path}`];
  }

  // Handle Duplicate Key Errors (MongoDB)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0]; // Get the duplicate field name
    message = `A user with this ${field} already exists`;
    details = [`${field} '${err.keyValue[field]}' is already in use`];
  }

  // Handle Custom Conflict Errors
  if (err.message && err.message.includes("User already exists")) {
    statusCode = 409;
    message = "Existing, Please use a different one.";
    details = ["Try using a different email."];
  }

  // Handle HTTP Errors (from createHttpError)
  if (err instanceof createHttpError.HttpError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details || [];
  }

  res.status(statusCode).json({
    status: statusCode,
    message,
    details: details.length > 0 ? details : undefined,
    timestamp: new Date().toISOString(),
  });
};

export default errorHandler;