const express = require("express");
const router = express.Router();
const planController = require("../controller/planController");
const authenticateToken = require("../middleware/auth");
const { isAdmin, isTeacherOrAdmin } = require("../middleware/roleMiddleware");

// Public routes
router.get("/", planController.getAllPlans);
router.get("/popular", planController.getMostPopular);
router.get("/:id", planController.getPlanById);

// Admin routes
router.post("/", authenticateToken, isAdmin, planController.createPlan);
router.put("/:id", authenticateToken, isAdmin, planController.updatePlan);
router.patch(
  "/:id/toggle-status",
  authenticateToken,
  isAdmin,
  planController.togglePlanStatus
);
router.delete("/:id", authenticateToken, isAdmin, planController.deletePlan);
router.get(
  "/stats/all",
  authenticateToken,
  isAdmin,
  planController.getPlanStats
);

module.exports = router;
