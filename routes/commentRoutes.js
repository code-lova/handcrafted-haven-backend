import express from "express";
import CommentController from "../controllers/CommentController.js";
import commentValidator from "../middleware/commentValidator.js";
import authorizeRole from "../middleware/authorizedRole.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  authorizeRole("buyer"),
  commentValidator.validateCreateComment,
  CommentController.createComment
);
router.get("/", CommentController.getAllComments);
router.get("/:id", authenticateUser, authorizeRole("buyer"), CommentController.getCommentById);
router.put(
  "/:id",
  authenticateUser,
  authorizeRole("buyer"),
  commentValidator.validateUpdateComment,
  CommentController.updateComment
);
router.delete("/:id", authenticateUser, authorizeRole("buyer"), CommentController.deleteComment);

export default router;
