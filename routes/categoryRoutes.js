import express from "express";
import CategoryController from "../controllers/CategoryController.js";
import categoryValidator from "../middleware/categoryValidator.js";
import authorizeRole from "../middleware/authorizedRole.js";

const router = express.Router();

// Create new category
router.post(
  "/",
  authorizeRole("seller"),
  categoryValidator.validateCreateCategory,
  CategoryController.createCategory
);

// Get all categories
router.get("/", authorizeRole("seller"), CategoryController.getAllCategories);

// Get single category by ID
router.get("/:id", authorizeRole("seller"), CategoryController.getCategoryById);

// Update category
router.put(
  "/:id",
  authorizeRole("seller"),
  categoryValidator.validateUpdateCategory,
  CategoryController.updateCategory
);

// Delete category
router.delete("/:id", authorizeRole("seller"), CategoryController.deleteCategory);

export default router;
