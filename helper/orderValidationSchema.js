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
  phone: Joi.string().min(11).max(14).required(),
  address: Joi.string().max(1000).required(),

  totalAmount: Joi.number().min(0).required().messages({
    "number.base": "Total amount must be a number",
    "number.min": "Total amount must be at least 0",
    "any.required": "Total amount is required",
  }),
  items: Joi.array()
    .items(
      Joi.object({
        storyId: Joi.string().custom(objectIdValidator).required(),
        name: Joi.string().required(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
  status: Joi.string()
    .valid("pending", "confirmed", "shipped", "delivered", "cancelled")
    .default("pending"),
  paymentIntentId: Joi.string().optional(),
  paymentStatus: Joi.string().valid("unpaid", "paid", "refunded").default("unpaid"),
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
