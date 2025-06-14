import Story from "../models/Story.js";

// Create Story
const createStory = async (data) => {
  const story = new Story(data);
  return await story.save();
};

//find story by name
const findStoryByName = async (name) => {
  return await Story.findOne({ name });
};

// Get All Stories
const getAllStories = async () => {
  return await Story.find().populate("categoryId", "name").sort({ createdAt: -1 });
};

// Get Story by ID
const getStoryById = async (sellerId) => {
  return await Story.find({ sellerId }).populate("categoryId", "name").sort({ createdAt: -1 });
};

// Get Story by ID
// const getStoryById = async (id) => {
//   return await Story.findById(id);
// };

// Update Story
const updateStory = async (id, data) => {
  return await Story.findByIdAndUpdate(id, data, { new: true });
};

// Delete Story
const deleteStory = async (id) => {
  return await Story.findByIdAndDelete(id);
};

const getStoriesByCategory = async (categoryId) => {
  return await Story.find({ category: categoryId, status: "active" }).sort({ createdAt: -1 });
};

const getStoriesByPriceRange = async (min, max) => {
  return await Story.find({
    price: { $gte: min, $lte: max },
    status: "active",
  }).sort({ price: 1 }); // optional sorting
};

export default {
  createStory,
  findStoryByName,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
  getStoriesByCategory,
  getStoriesByPriceRange,
};
