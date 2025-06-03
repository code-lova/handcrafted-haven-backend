import categoryValidationSchema from "../helper/categoryValidationSchema.js";
import createHttpError from "http-errors";

const validateCreateCategory = (req, res, next) => {
  const { error } = categoryValidationSchema.createCategorySchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return next(createHttpError(400, `Validation Error: ${errorMessages.join(", ")}`));
  }

  next();
};

const validateUpdateCategory = (req, res, next) => {
  const { error } = categoryValidationSchema.updateCategorySchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return next(createHttpError(400, `Validation Error: ${errorMessages.join(", ")}`));
  }

  next();
};

export default { validateCreateCategory, validateUpdateCategory };
