import express from "express";
import OrderController from "../controllers/OrderController.js";
import orderValidator from "../middleware/orderValidator.js";
import authenticateUser from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizedRole.js";

const router = express.Router();

//This is temporarly not used for now
router.post(
  "/",
  authenticateUser,
  authorizeRole("buyer"),
  orderValidator.validateCreateOrder,
  OrderController.createOrder
);

//Send data to stripe and return data to /success for new order creation
router.post(
  "/checkout",
  authenticateUser,
  authorizeRole("buyer"),
  OrderController.createStripeCheckoutSession
);

// this will create new order in DB after successful stripe payment
router.post("/success", OrderController.handleStripeSuccess); 

//Get all orders
router.get("/", authenticateUser, authorizeRole(["buyer", "seller"]), OrderController.getAllOrders);

//Get all orders made by a user
router.get(
  "/user-orders",
  authenticateUser,
  authorizeRole(["buyer", "seller"]),
  OrderController.getOrderById
);

router.put(
  "/:id",
  authenticateUser,
  authorizeRole("seller"),
  orderValidator.validateUpdateOrder,
  OrderController.updateOrder
);
router.delete("/:id", authenticateUser, authorizeRole("seller"), OrderController.deleteOrder);

export default router;
