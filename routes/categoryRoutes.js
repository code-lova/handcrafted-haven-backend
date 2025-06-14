import express from "express";
import CategoryController from "../controllers/CategoryController.js";
import categoryValidator from "../middleware/categoryValidator.js";
import authorizeRole from "../middleware/authorizedRole.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Create new category
router.post(
  "/",
  authenticateUser,
  authorizeRole("seller"),
  categoryValidator.validateCreateCategory,
  CategoryController.createCategory
);

// Get all categories
router.get("/", CategoryController.getAllCategories);

// Get single category by ID
router.get("/:id", authenticateUser, authorizeRole("seller"), CategoryController.getCategoryById);

// Update category
router.put(
  "/:id",
  authenticateUser,
  authorizeRole("seller"),
  categoryValidator.validateUpdateCategory,
  CategoryController.updateCategory
);

// Delete category
router.delete("/:id", authenticateUser, authorizeRole("seller"), CategoryController.deleteCategory);

export default router;
