import createHttpError from "http-errors";
import storyService from "../services/storyService.js";

// Create Story
const createStory = async (req, res, next) => {
  const { name, files, description, price, status, categoryId } = req.body;
  const sellerId = req.user.id;

  const existingStory = await storyService.findStoryByName(name);
  if (existingStory) {
    return next(createHttpError(409, "Story already exists"));
  }
  try {
    const data = { name, files, description, price, status, categoryId, sellerId };
    const story = await storyService.createStory(data);
    if (!story) {
      return next(createHttpError(500, "Failed to create new Story"));
    }
    res.status(201).json({ message: "Story created successfully", story });
  } catch (error) {
    next(error);
  }
};

// Get All Stories
const getAllStories = async (req, res, next) => {
  try {
    const stories = await storyService.getAllStories();
    res.status(200).json(stories);
  } catch (error) {
    next(error);
  }
};

// Get Story by ID
const getStoryById = async (req, res, next) => {
  const sellerId = req.user.id;
  try {
    const story = await storyService.getStoryById(sellerId);
    if (!story) {
      return next(createHttpError(404, "User Story not found"));
    }
    res.status(200).json(story);
  } catch (error) {
    next(error);
  }
};

// Update Story
const updateStory = async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(createHttpError(400, "Request cannot be empty"));
  }

  const id = req.params.id;
  try {
    const updatedStory = await storyService.updateStory(id, req.body);
    if (!updatedStory) {
      return next(createHttpError(404, "Story not found"));
    }
    res.status(200).json({ message: "Story updated successfully", updatedStory });
  } catch (error) {
    next(error);
  }
};

// Delete Story
const deleteStory = async (req, res, next) => {
  const id = req.params.id;

  try {
    const deleted = await storyService.deleteStory(id);
    if (!deleted) {
      return next(createHttpError(404, "Story not found"));
    }
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    next(error);
  }
};


const filterByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const stories = await storyService.getStoriesByCategory(categoryId);
    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    next(error);
  }
};

const filterByPrice = async (req, res, next) => {
  try {
    const min = parseFloat(req.query.min) || 0;
    const max = parseFloat(req.query.max) || Number.MAX_SAFE_INTEGER;
    const stories = await storyService.getStoriesByPriceRange(min, max);
    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    next(error);
  }
};

export default {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
  filterByCategory,
  filterByPrice,
};
