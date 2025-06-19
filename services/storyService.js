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
  return await Story.find()
    .populate("categoryId", "name")
    .populate("sellerId", "name")
    .sort({ createdAt: -1 });
};

//Get story by UUID
const getStoryUuid = async (uuid) => {
  return await Story.findOne({ uuid }).populate("categoryId", "name").populate("sellerId", "name");
};

// Get Story by ID that belongs to the user that made it
const getStoryBySeller = async (sellerId) => {
  return await Story.find({ sellerId }).populate("categoryId", "name").sort({ createdAt: -1 });
};

// Get Story by ID
const getStoryById = async (id) => {
  return await Story.findById(id);
};

// Update Story
const updateStory = async (id, data) => {
  return await Story.findByIdAndUpdate(id, data, { new: true });
};

// Delete Story
const deleteStory = async (id) => {
  return await Story.findByIdAndDelete(id);
};

const filterStories = async ({ categoryId, price }) => {
  const query = { status: "active" };

  if (categoryId) {
    query.categoryId = categoryId;
  }

  if (price) {
    const [min, max] = price.split("-").map(Number);
    query.price = { $gte: min, $lte: max };
  }

  return await Story.find(query).populate("categoryId", "name").sort({ createdAt: -1 });
};

export default {
  createStory,
  findStoryByName,
  getAllStories,
  getStoryBySeller,
  updateStory,
  deleteStory,
  filterStories,
  getStoryById,
  getStoryUuid,
};
