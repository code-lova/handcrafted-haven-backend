import Category from "../models/Category.js";

// Create a new category
const createCategory = async (data) => {
  const category = new Category(data);
  return await category.save();
};

//find category by name
const findCatByName = async(name) => {
  return await Category.findOne({ name })
}

// Get all categories
const getAllCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

// Get category by ID
const getCategoryById = async (id) => {
  return await Category.findById(id);
};

// Update category
const updateCategory = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

// Delete category
const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

export default {
  createCategory,
  getAllCategories,
  findCatByName,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
