import createHttpError from "http-errors";
import orderService from "../services/orderService.js";

const createOrder = async (req, res, next) => {
  const { storyId, amount, quantity, totalAmount, status } = req.body;
  const buyerId = req.user.id;
  const existingOrder = await orderService.findOrderById(storyId);
  if (existingOrder) {
    return next(createHttpError(409, "You already ordered this item"));
  }
  try {
    const data = { buyerId, storyId, amount, quantity, totalAmount, status };
    const order = await orderService.createOrder(data);
    if (!order) {
      return next(createHttpError(500, "Failed to create new Story"));
    }
    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return next(createHttpError(404, "Order not found"));
    }
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const updated = await orderService.updateOrder(req.params.id, req.body);
    if (!updated) {
      return next(createHttpError(404, "Order not found"));
    }
    res.status(200).json({ message: "Order updated successfully", updated });
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const deleted = await orderService.deleteOrder(req.params.id);
    if (!deleted) {
      return next(createHttpError(404, "Order not found"));
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
