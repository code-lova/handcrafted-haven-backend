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
router.get("/", StoryController.getAllStories);
router.get("/story-detail/:id", StoryController.getStoryDetails);

router.get(
  "/user-stories",
  authenticateUser,
  authorizeRole("seller"),
  StoryController.getStoryBySellerId
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRole("seller"),
  storyValidator.validateUpdateStory,
  StoryController.updateStory
);
router.delete("/:id", authenticateUser, authorizeRole("seller"), StoryController.deleteStory);

// Filtering
router.get("/filter", StoryController.filterStories);

export default router;
