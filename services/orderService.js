import Order from "../models/Order.js";

const createOrder = async (data) => {
  const order = new Order(data);
  return await order.save();
};

const findOrderById = async(id) => {
  return await Order.findById(id);
}

const getAllOrders = async () => {
  return await Order.find().populate("userId storyId").sort({ createdAt: -1 });
};

const getOrderById = async (id) => {
  return await Order.findById(id).populate("userId storyId");
};

const updateOrder = async (id, data) => {
  return await Order.findByIdAndUpdate(id, data, { new: true });
};

const deleteOrder = async (id) => {
  return await Order.findByIdAndDelete(id);
};

export default {
  createOrder,
  findOrderById,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
