const notificationModel = require("../model/notificationModel");

const notificationController = {
  // Get all notifications for the logged-in user
  getMyNotifications: async (req, res) => {
    try {
      const notifications = await notificationModel.findByUserId(req.user.id);
      const unreadCount = await notificationModel.getUnreadCount(req.user.id);

      res.status(200).json({
        success: true,
        data: notifications,
        unreadCount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
      });
    }
  },

  // Get unread notifications for the logged-in user
  getUnreadNotifications: async (req, res) => {
    try {
      const notifications = await notificationModel.findUnreadByUserId(
        req.user.id
      );

      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch unread notifications",
      });
    }
  },

  // Mark a notification as read
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;

      const notification = await notificationModel.markAsRead(id, req.user.id);

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: notification,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to mark notification as read",
      });
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      await notificationModel.markAllAsRead(req.user.id);

      res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to mark all notifications as read",
      });
    }
  },

  // Delete a notification
  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;

      const notification = await notificationModel.delete(id, req.user.id);

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Notification deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete notification",
      });
    }
  },

  // Delete all notifications
  deleteAllNotifications: async (req, res) => {
    try {
      await notificationModel.deleteAll(req.user.id);

      res.status(200).json({
        success: true,
        message: "All notifications deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete all notifications",
      });
    }
  },
};

module.exports = notificationController;
