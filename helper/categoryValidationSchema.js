import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name must not exceed 50 characters",
  }),

  status: Joi.string().valid("active", "not-active").default("active").messages({
    "any.only": "Status must be either 'active' or 'not-active'",
  }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name must not exceed 50 characters",
  }),

  status: Joi.string().valid("active", "not-active").messages({
    "any.only": "Status must be either 'active' or 'not-active'",
  }),
});

export default { createCategorySchema, updateCategorySchema };
