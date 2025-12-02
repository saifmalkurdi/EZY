const pool = require("../config/database");

const achievementModel = {
  // Get all achievements
  findAll: async (filters = {}) => {
    let query = `SELECT * FROM achievements WHERE 1=1`;
    const params = [];
    let paramCount = 1;

    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      params.push(filters.is_active);
      paramCount++;
    }

    query += ` ORDER BY display_order ASC, id ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  },

  // Get achievement by ID
  findById: async (id) => {
    const query = `SELECT * FROM achievements WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Create a new achievement
  create: async (achievementData) => {
    const {
      number,
      label,
      icon,
      display_order = 0,
      is_active = true,
    } = achievementData;

    const query = `
      INSERT INTO achievements (number, label, icon, display_order, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(query, [
      number,
      label,
      icon,
      display_order,
      is_active,
    ]);
    return result.rows[0];
  },

  // Update an achievement
  update: async (id, achievementData) => {
    const { number, label, icon, display_order, is_active } = achievementData;

    const query = `
      UPDATE achievements
      SET number = COALESCE($1, number),
          label = COALESCE($2, label),
          icon = COALESCE($3, icon),
          display_order = COALESCE($4, display_order),
          is_active = COALESCE($5, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const result = await pool.query(query, [
      number,
      label,
      icon,
      display_order,
      is_active,
      id,
    ]);
    return result.rows[0];
  },

  // Delete an achievement
  delete: async (id) => {
    const query = `DELETE FROM achievements WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = achievementModel;
