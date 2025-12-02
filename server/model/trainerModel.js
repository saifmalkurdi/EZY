const pool = require("../config/database");

const trainerModel = {
  // Get all trainers
  findAll: async (filters = {}) => {
    let query = `
      SELECT 
        t.*,
        u.email,
        u.phone
      FROM trainers t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (filters.is_active !== undefined) {
      query += ` AND t.is_active = $${paramCount}`;
      params.push(filters.is_active);
      paramCount++;
    }

    query += ` ORDER BY t.display_order ASC, t.id ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  },

  // Get trainer by ID
  findById: async (id) => {
    const query = `
      SELECT 
        t.*,
        u.email,
        u.phone
      FROM trainers t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Create a new trainer
  create: async (trainerData) => {
    const {
      user_id,
      name,
      title,
      description,
      rating = 4.5,
      reviews = 0,
      modules = 0,
      students = 0,
      profile_image,
      is_active = true,
      display_order = 0,
    } = trainerData;

    const query = `
      INSERT INTO trainers (
        user_id, name, title, description, rating, reviews, 
        modules, students, profile_image, is_active, display_order
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(query, [
      user_id,
      name,
      title,
      description,
      rating,
      reviews,
      modules,
      students,
      profile_image,
      is_active,
      display_order,
    ]);
    return result.rows[0];
  },

  // Update a trainer
  update: async (id, trainerData) => {
    const {
      user_id,
      name,
      title,
      description,
      rating,
      reviews,
      modules,
      students,
      profile_image,
      is_active,
      display_order,
    } = trainerData;

    const query = `
      UPDATE trainers
      SET user_id = COALESCE($1, user_id),
          name = COALESCE($2, name),
          title = COALESCE($3, title),
          description = COALESCE($4, description),
          rating = COALESCE($5, rating),
          reviews = COALESCE($6, reviews),
          modules = COALESCE($7, modules),
          students = COALESCE($8, students),
          profile_image = COALESCE($9, profile_image),
          is_active = COALESCE($10, is_active),
          display_order = COALESCE($11, display_order),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `;

    const result = await pool.query(query, [
      user_id,
      name,
      title,
      description,
      rating,
      reviews,
      modules,
      students,
      profile_image,
      is_active,
      display_order,
      id,
    ]);
    return result.rows[0];
  },

  // Delete a trainer
  delete: async (id) => {
    const query = `DELETE FROM trainers WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = trainerModel;
