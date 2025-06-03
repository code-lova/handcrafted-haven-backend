import express from "express";
import userController from "../controllers/userController.js";
import userValidator from "../middleware/userValidator.js";

const router = express.Router();

router.post("/register", userValidator.validateCreateUser, userController.registerUser);
// Login route for NextAuth
router.post("/login", userController.loginUser);

export default router;
