import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const createStorySchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Story name is required",
    "string.min": "Story name must be at least 3 characters",
    "string.max": "Story name must not exceed 100 characters",
  }),

  files: Joi.array().items(Joi.string().uri()).min(1).required().messages({
    "array.base": "Images must be an array of URLs",
    "array.min": "At least one image is required",
    "any.required": "Images are required",
  }),

  description: Joi.string().max(1000).required().messages({
    "string.empty": "Description is required",
    "string.max": "Description must not exceed 1000 characters",
  }),

  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),

  status: Joi.string().valid("active", "not-active").default("active").messages({
    "any.only": "Status must be either 'active' or 'not-active'",
  }),

  categoryId: Joi.string().custom(objectIdValidator).required().messages({
    "string.empty": "Category is required",
  }),

  sellerId: Joi.string().custom(objectIdValidator).required().messages({
    "string.empty": "SellerId is required",
  }),
});

export const updateStorySchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    "string.min": "Story name must be at least 3 characters",
    "string.max": "Story name must not exceed 100 characters",
  }),

  files: Joi.array().items(Joi.string().uri()).min(1).required().messages({
    "array.base": "Images must be an array of URLs",
    "array.min": "At least one image is required",
    "any.required": "Images are required",
  }),

  description: Joi.string().max(1000).messages({
    "string.max": "Description must not exceed 1000 characters",
  }),

  price: Joi.number().positive().messages({
    "number.positive": "Price must be a positive number",
  }),

  status: Joi.string().valid("active", "not-active").messages({
    "any.only": "Status must be either 'active' or 'not-active'",
  }),

  categoryId: Joi.string().custom(objectIdValidator).messages({
    "string.empty": "Category must not be empty",
  }),

  sellerId: Joi.string().custom(objectIdValidator).messages({
    "string.empty": "SellerId must not be empty",
  }),
});

export default { createStorySchema, updateStorySchema };
