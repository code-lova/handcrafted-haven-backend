import storyValidationSchema from "../helper/storyValidationSchema.js";
import createHttpError from "http-errors";

const validateCreateStory = (req, res, next) => {
  const { error } = storyValidationSchema.createStorySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return next(createHttpError(400, `Validation Error: ${errorMessages.join(", ")}`));
  }

  next();
};

const validateUpdateStory = (req, res, next) => {
  const { error } = storyValidationSchema.updateStorySchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return next(createHttpError(400, `Validation Error: ${errorMessages.join(", ")}`));
  }

  next();
};

export default { validateCreateStory, validateUpdateStory };
