const pool = require("../config/database");

const notificationModel = {
  // Create a notification
  create: async ({ user_id, title, message, type, data }) => {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, data) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [user_id, title, message, type, data ? JSON.stringify(data) : null]
    );
    return result.rows[0];
  },

  // Create notifications for multiple users
  createMany: async (notifications) => {
    const values = notifications
      .map(
        (_, i) =>
          `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${
            i * 5 + 5
          })`
      )
      .join(", ");
    const params = notifications.flatMap((n) => [
      n.user_id,
      n.title,
      n.message,
      n.type,
      n.data ? JSON.stringify(n.data) : null,
    ]);

    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, data) 
       VALUES ${values} 
       RETURNING *`,
      params
    );
    return result.rows;
  },

  // Get all notifications for a user
  findByUserId: async (user_id, limit = 50) => {
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [user_id, limit]
    );
    return result.rows;
  },

  // Get unread notifications for a user
  findUnreadByUserId: async (user_id) => {
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 AND is_read = false 
       ORDER BY created_at DESC`,
      [user_id]
    );
    return result.rows;
  },

  // Mark notification as read
  markAsRead: async (id, user_id) => {
    const result = await pool.query(
      `UPDATE notifications 
       SET is_read = true, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [id, user_id]
    );
    return result.rows[0];
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (user_id) => {
    const result = await pool.query(
      `UPDATE notifications 
       SET is_read = true, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 
       RETURNING *`,
      [user_id]
    );
    return result.rows;
  },

  // Delete a notification
  delete: async (id, user_id) => {
    const result = await pool.query(
      `DELETE FROM notifications 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [id, user_id]
    );
    return result.rows[0];
  },

  // Delete all notifications for a user
  deleteAll: async (user_id) => {
    const result = await pool.query(
      `DELETE FROM notifications 
       WHERE user_id = $1 
       RETURNING *`,
      [user_id]
    );
    return result.rows;
  },

  // Get unread count for a user
  getUnreadCount: async (user_id) => {
    const result = await pool.query(
      `SELECT COUNT(*) as count 
       FROM notifications 
       WHERE user_id = $1 AND is_read = false`,
      [user_id]
    );
    return parseInt(result.rows[0].count);
  },
};

module.exports = notificationModel;
