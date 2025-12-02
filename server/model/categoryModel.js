const pool = require("../config/database");

const categoryModel = {
  // Get all categories
  findAll: async (filters = {}) => {
    let query = `SELECT * FROM categories WHERE 1=1`;
    const params = [];
    let paramCount = 1;

    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      params.push(filters.is_active);
      paramCount++;
    }

    query += ` ORDER BY name ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  },

  // Get category by ID
  findById: async (id) => {
    const query = `SELECT * FROM categories WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Create a new category
  create: async (categoryData) => {
    const { name, color, is_active = true } = categoryData;

    const query = `
      INSERT INTO categories (name, color, is_active)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [name, color, is_active]);
    return result.rows[0];
  },

  // Update a category
  update: async (id, categoryData) => {
    const { name, color, is_active } = categoryData;

    const query = `
      UPDATE categories
      SET name = COALESCE($1, name),
          color = COALESCE($2, color),
          is_active = COALESCE($3, is_active)
      WHERE id = $4
      RETURNING *
    `;

    const result = await pool.query(query, [name, color, is_active, id]);
    return result.rows[0];
  },

  // Delete a category
  delete: async (id) => {
    const query = `DELETE FROM categories WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = categoryModel;
