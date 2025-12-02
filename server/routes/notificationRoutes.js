const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notificationController");
const authenticateToken = require("../middleware/auth");

// All routes require authentication
router.use(authenticateToken);

// Get all notifications for logged-in user
router.get("/my", notificationController.getMyNotifications);

// Get unread notifications
router.get("/unread", notificationController.getUnreadNotifications);

// Mark notification as read
router.put("/:id/read", notificationController.markAsRead);

// Mark all as read
router.put("/read-all", notificationController.markAllAsRead);

// Delete notification
router.delete("/:id", notificationController.deleteNotification);

// Delete all notifications
router.delete("/", notificationController.deleteAllNotifications);

module.exports = router;
