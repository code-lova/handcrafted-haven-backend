import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const createOrderSchema = Joi.object({
  buyerId: Joi.string().custom(objectIdValidator).required().messages({
    "any.required": "Byer ID is required",
    "any.invalid": "Buyer ID must be a valid ObjectId",
  }),
  sellerId: Joi.string().custom(objectIdValidator).required().messages({
    "any.required": "Seller ID is required",
    "any.invalid": "Sellr ID must be a valid ObjectId",
  }),
  storyId: Joi.string().custom(objectIdValidator).required().messages({
    "any.required": "Story ID is required",
    "any.invalid": "Story ID must be a valid ObjectId",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
  totalAmount: Joi.number().min(0).required().messages({
    "number.base": "Total amount must be a number",
    "number.min": "Total amount must be at least 0",
    "any.required": "Total amount is required",
  }),
  status: Joi.string()
    .valid("pending", "confirmed", "shipped", "delivered", "cancelled")
    .default("pending"),
});

const updateOrderSchema = Joi.object({
  quantity: Joi.number().integer().min(1).messages({
    "number.min": "Quantity must be at least 1",
  }),
  totalAmount: Joi.number().min(0).messages({
    "number.min": "Total amount must be at least 0",
  }),
  status: Joi.string().valid("pending", "confirmed", "shipped", "delivered", "cancelled").messages({
    "any.only": "Status must be one of: pending, confirmed, shipped, delivered, cancelled",
  }),
});

export default { createOrderSchema, updateOrderSchema };
