import createHttpError from "http-errors";
/**
 * Accepts one or more allowed roles (as a string or array).
 */
const authorizeRole = (allowedRoles) => {
  // Normalize to array in case a single role is passed
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return next(createHttpError(401, "Unauthorized: You must be logged in."));
    }

    if (!roles.includes(req.user.role)) {
      return next(createHttpError(403, "Forbidden: You do not have the required permissions."));
    }

    next();
  };
};

export default authorizeRole;
