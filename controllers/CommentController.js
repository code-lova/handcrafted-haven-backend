import createHttpError from "http-errors";
import commentService from "../services/commentService.js";

// Create comment
const createComment = async (req, res, next) => {
  const { content, storyId } = req.body;
  const userId = req.user.id;
  try {
    const data = { content, storyId, userId };
    const comment = await commentService.createComment(data);
    if (!comment) {
      return next(createHttpError(500, "Failed to create new Story"));
    }
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (err) {
    next(err);
  }
};

// Get all comments
const getAllComments = async (req, res, next) => {
  try {
    const comments = await commentService.getAllComments();
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

const getCommentsByStoryId = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsByStoryId(req.params.id);
     if (!comments) {
      return next(createHttpError(404, "Comment not found"));
    }
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

// Update comment
const updateComment = async (req, res, next) => {
  const id = req.params.id;

  try {
    const updated = await commentService.updateComment(id, req.body);
    if (!updated) {
      return next(createHttpError(404, "Comment not found"));
    }
    res.status(200).json({ message: "Comment updated successfully", updated });
  } catch (err) {
    next(err);
  }
};

// Delete comment
const deleteComment = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deleted = await commentService.deleteComment(id);
    if (!deleted) {
      return next(createHttpError(404, "Comment not found"));
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export default {
  createComment,
  getAllComments,
  getCommentsByStoryId,
  updateComment,
  deleteComment,
};
