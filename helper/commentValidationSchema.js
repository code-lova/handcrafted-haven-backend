import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const createCommentSchema = Joi.object({
  storyId: Joi.string().custom(objectIdValidator).required().messages({
    "any.required": "Story ID is required",
    "any.invalid": "Story ID must be a valid ObjectId",
  }),
  userId: Joi.string().custom(objectIdValidator).required().messages({
    "any.required": "User ID is required",
    "any.invalid": "User ID must be a valid ObjectId",
  }),
  content: Joi.string().min(3).max(1000).required().messages({
    "string.empty": "Comment content is required",
    "string.min": "Comment must be at least 3 characters",
    "string.max": "Comment must not exceed 1000 characters",
  }),
});

const updateCommentSchema = Joi.object({
  content: Joi.string().min(3).max(1000).messages({
    "string.min": "Comment must be at least 3 characters",
    "string.max": "Comment must not exceed 1000 characters",
  }),
});

export default { createCommentSchema, updateCommentSchema };
