const express = require("express");
const router = express.Router();
const trainerController = require("../controller/trainerController");
const authenticateToken = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleMiddleware");

// Public routes
router.get("/", trainerController.getAllTrainers);
router.get("/:id", trainerController.getTrainerById);

// Admin routes
router.post("/", authenticateToken, isAdmin, trainerController.createTrainer);
router.put("/:id", authenticateToken, isAdmin, trainerController.updateTrainer);
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  trainerController.deleteTrainer
);

module.exports = router;
