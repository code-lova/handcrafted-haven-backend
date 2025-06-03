import orderValidationSchema from "../helper/orderValidationSchema.js";
import createHttpError from "http-errors";

const validateCreateOrder = (req, res, next) => {
  const { error } = orderValidationSchema.createOrderSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return next(createHttpError(400, `Validation Error: ${errorMessages.join(", ")}`));
  }

  next();
};

const validateUpdateOrder = (req, res, next) => {
  const { error } = orderValidationSchema.updateOrderSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((d) => d.message);
    return next(createHttpError(400, `Validation Error: ${errorMessages.join(", ")}`));
  }

  next();
};

export default { validateCreateOrder, validateUpdateOrder };
