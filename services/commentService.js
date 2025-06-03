import Comment from "../models/Comment.js";

// Create comment
const createComment = async (data) => {
  const comment = new Comment(data);
  return await comment.save();
};

// Get all comments
const getAllComments = async () => {
  return await Comment.find().sort({ createdAt: -1 });
};

// Get comment by ID
const getCommentById = async (id) => {
  return await Comment.findById(id);
};

// Update comment
const updateComment = async (id, data) => {
  return await Comment.findByIdAndUpdate(id, data, { new: true });
};

// Delete comment
const deleteComment = async (id) => {
  return await Comment.findByIdAndDelete(id);
};

export default {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
};
