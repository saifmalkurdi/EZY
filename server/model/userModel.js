const pool = require("../config/database");

const userModel = {
  // Create a new user
  create: async (userData) => {
    try {
      const {
        full_name,
        email,
        password,
        phone,
        role = "customer",
        profile_image,
      } = userData;
      const result = await pool.query(
        `INSERT INTO users (full_name, email, password, phone, role, profile_image, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, true) 
         RETURNING id, full_name, email, phone, role, profile_image, is_active, created_at`,
        [full_name, email, password, phone, role, profile_image]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const result = await pool.query(
        `SELECT id, full_name, email, phone, role, profile_image, is_active, created_at, updated_at 
         FROM users WHERE id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Find user by email (includes password for authentication)
  findByEmail: async (email) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Find user by email (without password)
  findByEmailSafe: async (email) => {
    try {
      const result = await pool.query(
        `SELECT id, full_name, email, phone, role, profile_image, is_active, created_at, updated_at 
         FROM users WHERE email = $1`,
        [email]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userId, updateData) => {
    try {
      const { full_name, phone, profile_image } = updateData;
      const result = await pool.query(
        `UPDATE users 
         SET full_name = COALESCE($1, full_name),
             phone = COALESCE($2, phone),
             profile_image = COALESCE($3, profile_image)
         WHERE id = $4
         RETURNING id, full_name, email, phone, role, profile_image, is_active, created_at, updated_at`,
        [full_name, phone, profile_image, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Update user status (activate/deactivate)
  updateStatus: async (userId, isActive) => {
    try {
      const result = await pool.query(
        `UPDATE users SET is_active = $1 WHERE id = $2 
         RETURNING id, full_name, email, is_active`,
        [isActive, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get all users (admin only)
  findAll: async (filters = {}) => {
    try {
      let query = `SELECT id, full_name, email, phone, role, profile_image, is_active, created_at, updated_at 
                   FROM users WHERE 1=1`;
      const params = [];
      let paramCount = 1;

      // Filter by role
      if (filters.role) {
        query += ` AND role = $${paramCount}`;
        params.push(filters.role);
        paramCount++;
      }

      // Filter by active status
      if (filters.is_active !== undefined) {
        query += ` AND is_active = $${paramCount}`;
        params.push(filters.is_active);
        paramCount++;
      }

      query += ` ORDER BY created_at DESC`;

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Get users by role
  findByRole: async (role) => {
    try {
      const result = await pool.query(
        `SELECT id, full_name, email, phone, role, profile_image, is_active, created_at 
         FROM users WHERE role = $1 AND is_active = true 
         ORDER BY created_at DESC`,
        [role]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Delete user by ID
  deleteUser: async (userId) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // First get the user's role
      const userResult = await client.query(
        "SELECT role FROM users WHERE id = $1",
        [userId]
      );

      if (userResult.rows.length === 0) {
        throw new Error("User not found");
      }

      const userRole = userResult.rows[0].role;

      // If user is a teacher, we need to handle their courses specially
      // Since courses have ON DELETE SET NULL for teacher_id, but we want to delete courses
      if (userRole === "teacher") {
        // Delete course purchases first (they have CASCADE from courses, but let's be explicit)
        await client.query(
          "DELETE FROM course_purchases WHERE course_id IN (SELECT id FROM courses WHERE teacher_id = $1)",
          [userId]
        );
        // Delete the courses
        await client.query("DELETE FROM courses WHERE teacher_id = $1", [
          userId,
        ]);
      }

      // For all users, delete related data that doesn't have CASCADE
      // (most relationships already have CASCADE in the schema)

      // Finally delete the user - this will CASCADE delete:
      // - notifications (CASCADE)
      // - plan_purchases (CASCADE)
      // - course_purchases (CASCADE)
      // - trainers (CASCADE)
      // And SET NULL in courses.teacher_id and plans.created_by
      const result = await client.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [userId]
      );

      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // Get user count by role (for admin dashboard)
  getCountByRole: async () => {
    try {
      const result = await pool.query(
        `SELECT role, COUNT(*) as count 
         FROM users 
         WHERE is_active = true 
         GROUP BY role`
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Update FCM token for push notifications
  updateFcmToken: async (userId, fcmToken) => {
    try {
      const result = await pool.query(
        `UPDATE users SET fcm_token = $1 WHERE id = $2 RETURNING id`,
        [fcmToken, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get FCM tokens by role (for sending notifications to specific user types)
  getFcmTokensByRole: async (role) => {
    try {
      const result = await pool.query(
        `SELECT fcm_token FROM users WHERE role = $1 AND fcm_token IS NOT NULL AND is_active = true`,
        [role]
      );
      return result.rows.map((row) => row.fcm_token);
    } catch (error) {
      throw error;
    }
  },

  // Get user IDs by role (for saving notifications to database)
  getUserIdsByRole: async (role) => {
    try {
      const result = await pool.query(
        `SELECT id FROM users WHERE role = $1 AND is_active = true`,
        [role]
      );
      return result.rows.map((row) => row.id);
    } catch (error) {
      throw error;
    }
  },

  // Get FCM token for a specific user
  getFcmToken: async (userId) => {
    try {
      const result = await pool.query(
        `SELECT fcm_token FROM users WHERE id = $1`,
        [userId]
      );
      return result.rows[0]?.fcm_token;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userModel;
