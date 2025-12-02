/**
 * Notification helper utilities
 * Centralizes notification logic to avoid code duplication
 */

const userModel = require("../model/userModel");
const {
  sendNotification,
  sendMulticastNotification,
} = require("../services/firebaseService");

/**
 * Send notification to a single user by ID
 * @param {number} userId - User ID to send notification to
 * @param {object} notification - Notification object with title and body
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<void>}
 */
const notifyUser = async (userId, notification, data = {}) => {
  try {
    const userToken = await userModel.getFcmToken(userId);
    if (userToken) {
      await sendNotification(userToken, notification, {
        ...data,
        userId: userId.toString(),
      });
    }
  } catch (error) {
    // Silent fail - notification is not critical
  }
};

/**
 * Send notification to all users with a specific role
 * @param {string} role - User role (admin, teacher, customer)
 * @param {object} notification - Notification object with title and body
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<void>}
 */
const notifyRole = async (role, notification, data = {}) => {
  try {
    const tokens = await userModel.getFcmTokensByRole(role);
    const userIds = await userModel.getUserIdsByRole(role);

    if (tokens.length > 0) {
      await sendMulticastNotification(tokens, notification, data, userIds);
    }
  } catch (error) {
    // Silent fail - notification is not critical
  }
};

/**
 * Send notification to admins
 * @param {object} notification - Notification object with title and body
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<void>}
 */
const notifyAdmins = async (notification, data = {}) => {
  return notifyRole("admin", notification, data);
};

/**
 * Send notification to teachers
 * @param {object} notification - Notification object with title and body
 * @param {object} data - Additional data to send with notification
 * @returns {Promise<void>}
 */
const notifyTeachers = async (notification, data = {}) => {
  return notifyRole("teacher", notification, data);
};

module.exports = {
  notifyUser,
  notifyRole,
  notifyAdmins,
  notifyTeachers,
};
