const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const authenticateToken = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);
router.get("/profile", authenticateToken, authController.getProfile);
router.delete("/delete", authenticateToken, authController.deleteAccount);
router.put("/fcm-token", authenticateToken, authController.updateFcmToken);

// Admin only routes
router.post(
  "/teachers",
  authenticateToken,
  isAdmin,
  authController.createTeacher
);

module.exports = router;
