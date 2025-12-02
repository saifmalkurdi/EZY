const express = require("express");
const router = express.Router();
const achievementController = require("../controller/achievementController");
const authenticateToken = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleMiddleware");

// Public routes
router.get("/", achievementController.getAllAchievements);
router.get("/:id", achievementController.getAchievementById);

// Admin routes
router.post(
  "/",
  authenticateToken,
  isAdmin,
  achievementController.createAchievement
);
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  achievementController.updateAchievement
);
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  achievementController.deleteAchievement
);

module.exports = router;
