import createHttpError from "http-errors";
import storyService from "../services/storyService.js";
import cloudinary from "../config/cloudinary.js";

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

const getStoryDetails = async (req, res, next) => {
  const storyUuid = req.params.id;
  try {
    const story = await storyService.getStoryUuid(storyUuid);

    if (!story) {
      return next(createHttpError(404, "Story not found"));
    }

    res.status(200).json(story);
  } catch (error) {
    next(error);
  }
};

// Get Story by ID
const getStoryBySellerId = async (req, res, next) => {
  const sellerId = req.user.id;
  try {
    const story = await storyService.getStoryBySeller(sellerId);
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

  const storyId = req.params.id;
  const sellerId = req.user.id;
  const { files: updatedFiles } = req.body;
  try {
    const existingStory = await storyService.getStoryById(storyId);

    if (!existingStory) {
      return next(createHttpError(404, "Story not found"));
    }

    // Ensure the user is the owner
    if (existingStory.sellerId.toString() !== sellerId) {
      return next(createHttpError(403, "You are not authorized to update this story"));
    }

    // Determine which images were removed
    const existingPublicIds = existingStory.files.map((img) => img.public_id);
    const updatedPublicIds = updatedFiles.map((img) => img.public_id);
    const imagesToDelete = existingPublicIds.filter((id) => !updatedPublicIds.includes(id));

    // Delete removed images from Cloudinary
    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map((public_id) => cloudinary.uploader.destroy(public_id)));
    }
    // Proceed with update
    const updatedStory = await storyService.updateStory(storyId, req.body);

    res.status(200).json({ message: "Story updated successfully", updatedStory });
  } catch (error) {
    next(error);
  }
};

// Delete Story
const deleteStory = async (req, res, next) => {
  const id = req.params.id;

  try {
    const existingStory = await storyService.getStoryById(id);

    if (!existingStory) {
      return next(createHttpError(404, "Story not found"));
    }

    // Delete all images from Cloudinary
    const publicIds = existingStory.files.map((file) => file.public_id);

    if (publicIds.length > 0) {
      await Promise.all(publicIds.map((public_id) => cloudinary.uploader.destroy(public_id)));
    }

    const deleted = await storyService.deleteStory(id);
    if (!deleted) {
      return next(createHttpError(404, "Story not found"));
    }
    res.status(200).json({ message: "Story and associated images deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const filterStories = async (req, res, next) => {
  try {
    const { category, price } = req.query;
    const stories = await storyService.filterStories({ categoryId: category, price });
    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    next(error);
  }
};


export default {
  createStory,
  getAllStories,
  getStoryBySellerId,
  updateStory,
  deleteStory,
  filterStories,
  getStoryDetails
};
