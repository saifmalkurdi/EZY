const pool = require("../config/database");

const planModel = {
  // Create a new plan (Admin only)
  create: async (planData) => {
    const {
      title,
      description,
      price,
      price_note,
      gst_note,
      features,
      button_text,
      duration_days = 30,
      is_highlighted = false,
      is_active = true,
      created_by,
    } = planData;

    // Ensure features is properly formatted
    let processedFeatures = features;

    if (typeof processedFeatures === "string") {
      try {
        processedFeatures = JSON.parse(processedFeatures);
        if (!Array.isArray(processedFeatures)) {
          processedFeatures = [];
        }
      } catch (error) {
        processedFeatures = [];
      }
    } else if (!Array.isArray(processedFeatures)) {
      processedFeatures = [];
    }

    // Convert array to JSON string for PostgreSQL
    processedFeatures = JSON.stringify(processedFeatures);

    const query = `
      INSERT INTO plans (title, price, price_note, gst_note, description, features, button_text, duration_days, is_highlighted, is_active, created_by)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(query, [
      title,
      price,
      price_note,
      gst_note,
      description,
      processedFeatures,
      button_text,
      duration_days,
      is_highlighted,
      is_active,
      created_by,
    ]);

    return result.rows[0];
  },

  // Get all plans
  findAll: async (filters = {}) => {
    // First, get the total count
    let countQuery = `SELECT COUNT(*) FROM plans WHERE 1=1`;
    const countParams = [];
    let countParamCount = 1;

    // Filter by active status
    if (filters.is_active !== undefined) {
      countQuery += ` AND is_active = $${countParamCount}`;
      countParams.push(filters.is_active);
      countParamCount++;
    }

    // Search by title or description
    if (filters.search) {
      countQuery += ` AND (title ILIKE $${countParamCount} OR description ILIKE $${countParamCount})`;
      countParams.push(`%${filters.search}%`);
      countParamCount++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    // Now get the actual data
    let query = `SELECT * FROM plans WHERE 1=1`;
    const params = [];
    let paramCount = 1;

    // Filter by active status
    if (filters.is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      params.push(filters.is_active);
      paramCount++;
    }

    // Search by title or description
    if (filters.search) {
      query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC`;

    // Pagination
    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
      paramCount++;
    }

    const result = await pool.query(query, params);
    // Ensure features is always an array
    const plans = result.rows.map((row) => ({
      ...row,
      features: Array.isArray(row.features) ? row.features : [],
    }));

    return { plans, total };
  },

  // Get plan by ID
  findById: async (id) => {
    const query = `SELECT * FROM plans WHERE id = $1`;
    const result = await pool.query(query, [id]);
    const plan = result.rows[0];
    if (plan) {
      plan.features = Array.isArray(plan.features) ? plan.features : [];
    }
    return plan;
  },

  // Update plan (Admin only)
  update: async (id, planData) => {
    const {
      title,
      description,
      price,
      price_note,
      gst_note,
      features,
      button_text,
      duration_days,
      is_highlighted,
      is_active,
    } = planData;

    // Ensure features is properly formatted as a JSON array
    let processedFeatures = features;

    if (features === undefined || features === null) {
      processedFeatures = undefined; // Let COALESCE handle it
    } else if (typeof features === "string") {
      try {
        processedFeatures = JSON.parse(features);
        if (!Array.isArray(processedFeatures)) {
          processedFeatures = [];
        }
      } catch (error) {
        processedFeatures = [];
      }
    } else if (Array.isArray(features)) {
      // Features is already an array, stringify it for PostgreSQL
      processedFeatures = JSON.stringify(features);
    } else {
      // Invalid type
      processedFeatures = JSON.stringify([]);
    }

    const query = `
      UPDATE plans
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        price_note = COALESCE($4, price_note),
        gst_note = COALESCE($5, gst_note),
        features = COALESCE($6::jsonb, features),
        button_text = COALESCE($7, button_text),
        duration_days = COALESCE($8, duration_days),
        is_highlighted = CASE WHEN $9::boolean IS NULL THEN is_highlighted ELSE $9::boolean END,
        is_active = CASE WHEN $10::boolean IS NULL THEN is_active ELSE $10::boolean END
      WHERE id = $11
      RETURNING *
    `;

    const result = await pool.query(query, [
      title,
      description,
      price,
      price_note,
      gst_note,
      processedFeatures,
      button_text,
      duration_days,
      is_highlighted,
      is_active,
      id,
    ]);

    return result.rows[0];
  },

  // Delete plan (Admin only)
  delete: async (id) => {
    const query = `DELETE FROM plans WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Get plan statistics
  getStats: async () => {
    const query = `
      SELECT 
        COUNT(*) as total_plans,
        COUNT(*) FILTER (WHERE is_active = true) as active_plans,
        COUNT(*) FILTER (WHERE is_active = false) as inactive_plans,
        AVG(price) as average_price
      FROM plans
    `;

    const result = await pool.query(query);
    return result.rows[0];
  },

  // Get most popular plans (by purchase count)
  getMostPopular: async (limit = 5) => {
    const query = `
      SELECT 
        p.*,
        COUNT(pp.id) as purchase_count
      FROM plans p
      LEFT JOIN plan_purchases pp ON p.id = pp.plan_id
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY purchase_count DESC, p.created_at DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  },
};

module.exports = planModel;
