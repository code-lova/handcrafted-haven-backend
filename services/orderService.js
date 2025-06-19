import Order from "../models/Order.js";

const createOrder = async (data) => {
  const order = new Order(data);
  return await order.save();
};

const findOrderById = async (id) => {
  return await Order.findOne(id);
};

const getAllOrders = async () => {
  return await Order.find().populate("storyId").sort({ createdAt: -1 });
};


const getOrdersByUser = async (buyerId) => {
  return await Order.find({ buyerId }).populate({
    path: "items.storyId",
    populate: {
      path: "sellerId", // Story model has sellerId as a ref to User
      select: "name", // only fetch seller name
    },
  }).select("-paymentIntentId -uuid -paymentStatus");
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
  getOrdersByUser,
  updateOrder,
  deleteOrder,
};
