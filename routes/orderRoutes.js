import express from "express";
import OrderController from "../controllers/OrderController.js";
import orderValidator from "../middleware/orderValidator.js";
import authenticateUser from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizedRole.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeRole("buyer"), orderValidator.validateCreateOrder, OrderController.createOrder);
router.get("/", authenticateUser, authorizeRole(["buyer", "seller"]), OrderController.getAllOrders);
router.get("/:id", authenticateUser, authorizeRole(["buyer", "seller"]), OrderController.getOrderById);
router.put("/:id", authenticateUser, authorizeRole("seller"), orderValidator.validateUpdateOrder, OrderController.updateOrder);
router.delete("/:id", authenticateUser, authorizeRole("seller"), OrderController.deleteOrder);

export default router;
