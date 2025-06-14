import express from "express";
import StoryController from "../controllers/StoryController.js";
import storyValidator from "../middleware/storyValidator.js";
import authorizeRole from "../middleware/authorizedRole.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  authorizeRole("seller"),
  storyValidator.validateCreateStory,
  StoryController.createStory
);
router.get("/", authenticateUser, authorizeRole("seller"), StoryController.getAllStories);
router.get("/user-story", authenticateUser, authorizeRole("seller"), StoryController.getStoryById);
router.put(
  "/:id",
  authenticateUser,
  authorizeRole("seller"),
  storyValidator.validateUpdateStory,
  StoryController.updateStory
);
router.delete("/:id", authenticateUser, authorizeRole("seller"), StoryController.deleteStory);

// Filtering
router.get("/filter-by-category/:categoryId", StoryController.filterByCategory);
router.get("/filter-by-price", StoryController.filterByPrice);


export default router;
