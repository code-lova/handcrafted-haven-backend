import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import createHttpError from "http-errors";

dotenv.config();

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createHttpError(401, "Unauthorized: Please log in."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request
    next();
  // eslint-disable-next-line no-unused-vars
  } catch(error) {
    return next(createHttpError(401, "Session has expired. Please log in again."));
  }
};

export default authenticateUser;
