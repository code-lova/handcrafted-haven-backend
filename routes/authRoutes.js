import express from "express";
import userController from "../controllers/userController.js";
import userValidator from "../middleware/userValidator.js";
import authenticateUser from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", userValidator.validateCreateUser, userController.registerUser);
// Login route for NextAuth
router.post("/login", userController.loginUser);

//get user details
router.get("/user", authenticateUser, userController.getUser)

router.put("/user", authenticateUser, userController.updateProfile);

//Logout handler
router.get("/logout", userController.logoutHandler)
export default router;
