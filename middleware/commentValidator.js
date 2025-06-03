import commentValidationSchema from "../helper/commentValidationSchema.js";
import createHttpError from "http-errors";

const validateCreateComment = (req, res, next) => {
  const { error } = commentValidationSchema.createCommentSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return next(createHttpError(400, `Validation Error: ${errorMessages.join(", ")}`));
  }

  next();
};

const validateUpdateComment = (req, res, next) => {
  const { error } = commentValidationSchema.updateCommentSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((d) => d.message);
    return next(createHttpError(400, `Validation Error: ${errorMessages.join(", ")}`));
  }

  next();
};

export default { validateCreateComment, validateUpdateComment };
