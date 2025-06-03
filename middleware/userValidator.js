import userValidationSchema from "../helper/userValidationSchema.js";
import createHttpError from "http-errors";



const validateCreateUser = (req, res, next) => {
  const { error } = userValidationSchema.createUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return next(createHttpError(400, `Validation Error: ${errorMessages.join(", ")}`));
  }

  next();
};

const validateUpdateUser = (req, res, next) => {
  const { error } = userValidationSchema.updateUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return next(createHttpError(400, `Validation Error: ${errorMessages.join(", ")}`));
  }

  next();
};

export default { validateCreateUser, validateUpdateUser}