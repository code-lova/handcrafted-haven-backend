import createHttpError from "http-errors";
import categoryService from "../services/categoryService.js";

// Create a new category
const createCategory = async (req, res, next) => {
  const { name, status } = req.body;
  try {
    const existingCategory = await categoryService.findCatByName(name);
    if (existingCategory) {
      return next(createHttpError(409, "Category already exists"));
    }

    const data = { name, status };
    const category = await categoryService.createCategory(data);
    if (!category) {
      return next(createHttpError(500, "Failed to create new Category"));
    }
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    next(error);
  }
};

// Get all categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// Get category by ID
const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return next(createHttpError(404, "Category not found"));
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// Update category
const updateCategory = async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(createHttpError(400, "Request body cannot be empty"));
  }
  const id = req.params.id;
  try {
    const updatedCategory = await categoryService.updateCategory(id, req.body);
    if (!updatedCategory) {
      return next(createHttpError(404, "Category not found"));
    }
    res.status(200).json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    next(error);
  }
};

// Delete category
const deleteCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deleted = await categoryService.deleteCategory(id);
    if (!deleted) {
      return next(createHttpError(404, "Category not found"));
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
