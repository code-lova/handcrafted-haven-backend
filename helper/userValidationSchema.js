import Joi from "joi";

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 100 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
  confirmPassword: Joi.string().min(6).max(100),

  role: Joi.string().valid("seller", "buyer").default("buyer").messages({
    "any.only": "Role must be either 'seller' or 'buyer'",
  }),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must not exceed 100 characters",
  }),

  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email address",
  }),

  phone: Joi.string()
    .pattern(/^\+\d+$/)
    .messages({
      "string.pattern.base": "Phone number must start with '+' followed by digits",
    })
    .optional(),

  address: Joi.string().min(5).max(255).optional().messages({
    "string.min": "Address must be at least 5 characters",
    "string.max": "Address must not exceed 255 characters",
  }),

  password: Joi.string().min(6).messages({
    "string.min": "Password must be at least 6 characters",
  }),

  role: Joi.string().valid("seller", "buyer").messages({
    "any.only": "Role must be either 'seller' or 'buyer'",
  }),
});

export default { createUserSchema, updateUserSchema };
