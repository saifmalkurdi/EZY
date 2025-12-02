const pool = require("../config/database");

const courseModel = {
  // Create a new course (Teacher only)
  create: async (courseData) => {
    const {
      teacher_id,
      title,
      description,
      thumbnail_url,
      price,
      duration,
      duration_days = 30,
      level,
      category,
      icon,
      objectives,
      curriculum,
      tools,
      is_active = true,
    } = courseData;

    const query = `
      INSERT INTO courses (
        teacher_id, title, description, thumbnail_url, price, duration, duration_days,
        level, category, icon, objectives, curriculum, tools, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const result = await pool.query(query, [
      teacher_id,
      title,
      description,
      thumbnail_url,
      price,
      duration,
      duration_days,
      level,
      category,
      icon,
      JSON.stringify(objectives),
      JSON.stringify(curriculum),
      JSON.stringify(tools),
      is_active,
    ]);

    return result.rows[0];
  },

  // Get all courses with optional filters
  findAll: async (filters = {}) => {
    // First, get the total count
    let countQuery = `
      SELECT COUNT(DISTINCT c.id) as count
      FROM courses c
      WHERE 1=1
    `;
    const countParams = [];
    let countParamCount = 1;

    // Filter by active status
    if (filters.is_active !== undefined) {
      countQuery += ` AND c.is_active = $${countParamCount}`;
      countParams.push(filters.is_active);
      countParamCount++;
    }

    // Filter by teacher
    if (filters.teacher_id) {
      countQuery += ` AND c.teacher_id = $${countParamCount}`;
      countParams.push(filters.teacher_id);
      countParamCount++;
    }

    // Filter by category
    if (filters.category) {
      countQuery += ` AND c.category = $${countParamCount}`;
      countParams.push(filters.category);
      countParamCount++;
    }

    // Filter by level
    if (filters.level) {
      countQuery += ` AND c.level = $${countParamCount}`;
      countParams.push(filters.level);
      countParamCount++;
    }

    // Search by title or description
    if (filters.search) {
      countQuery += ` AND (c.title ILIKE $${countParamCount} OR c.description ILIKE $${countParamCount})`;
      countParams.push(`%${filters.search}%`);
      countParamCount++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    // Now get the actual data
    let query = `
      SELECT 
        c.*,
        u.full_name as teacher_name,
        u.email as teacher_email,
        COUNT(cp.id) as enrollment_count
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.id
      LEFT JOIN course_purchases cp ON c.id = cp.course_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Filter by active status
    if (filters.is_active !== undefined) {
      query += ` AND c.is_active = $${paramCount}`;
      params.push(filters.is_active);
      paramCount++;
    }

    // Filter by teacher
    if (filters.teacher_id) {
      query += ` AND c.teacher_id = $${paramCount}`;
      params.push(filters.teacher_id);
      paramCount++;
    }

    // Filter by category
    if (filters.category) {
      query += ` AND c.category = $${paramCount}`;
      params.push(filters.category);
      paramCount++;
    }

    // Filter by level
    if (filters.level) {
      query += ` AND c.level = $${paramCount}`;
      params.push(filters.level);
      paramCount++;
    }

    // Search by title or description
    if (filters.search) {
      query += ` AND (c.title ILIKE $${paramCount} OR c.description ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ` GROUP BY c.id, u.full_name, u.email`;
    query += ` ORDER BY c.created_at DESC`;

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
    return { courses: result.rows, total };
  },

  // Get course by ID
  findById: async (id) => {
    const query = `
      SELECT 
        c.*,
        u.full_name as teacher_name,
        u.email as teacher_email,
        u.profile_image as teacher_image,
        COUNT(cp.id) as enrollment_count
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.id
      LEFT JOIN course_purchases cp ON c.id = cp.course_id
      WHERE c.id = $1
      GROUP BY c.id, u.full_name, u.email, u.profile_image
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Update course (Teacher - own courses only)
  update: async (id, courseData) => {
    const {
      title,
      description,
      thumbnail_url,
      price,
      duration,
      duration_days,
      level,
      category,
      icon,
      objectives,
      curriculum,
      tools,
      is_active,
    } = courseData;

    const query = `
      UPDATE courses
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        thumbnail_url = COALESCE($3, thumbnail_url),
        price = COALESCE($4, price),
        duration = COALESCE($5, duration),
        duration_days = COALESCE($6, duration_days),
        level = COALESCE($7, level),
        category = COALESCE($8, category),
        icon = COALESCE($9, icon),
        objectives = COALESCE($10, objectives),
        curriculum = COALESCE($11, curriculum),
        tools = COALESCE($12, tools),
        is_active = COALESCE($13, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `;

    const result = await pool.query(query, [
      title,
      description,
      thumbnail_url,
      price,
      duration,
      duration_days,
      level,
      category,
      icon,
      objectives ? JSON.stringify(objectives) : null,
      curriculum ? JSON.stringify(curriculum) : null,
      tools ? JSON.stringify(tools) : null,
      is_active,
      id,
    ]);

    return result.rows[0];
  },

  // Delete course
  delete: async (id) => {
    const query = `DELETE FROM courses WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Get courses by teacher
  findByTeacher: async (teacherId) => {
    const query = `
      SELECT 
        c.*,
        COUNT(cp.id) as enrollment_count
      FROM courses c
      LEFT JOIN course_purchases cp ON c.id = cp.course_id
      WHERE c.teacher_id = $1
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;

    const result = await pool.query(query, [teacherId]);
    return result.rows;
  },

  // Get course statistics for a teacher
  getTeacherStats: async (teacherId) => {
    const query = `
      SELECT 
        COUNT(*) as total_courses,
        COUNT(*) FILTER (WHERE is_active = true) as active_courses,
        COUNT(*) FILTER (WHERE is_active = false) as inactive_courses,
        COALESCE(SUM(price), 0) as total_value,
        COALESCE(AVG(price), 0) as average_price
      FROM courses
      WHERE teacher_id = $1
    `;

    const result = await pool.query(query, [teacherId]);
    return result.rows[0];
  },

  // Get popular courses
  getMostPopular: async (limit = 10) => {
    const query = `
      SELECT 
        c.*,
        u.full_name as teacher_name,
        COUNT(cp.id) as enrollment_count
      FROM courses c
      LEFT JOIN users u ON c.teacher_id = u.id
      LEFT JOIN course_purchases cp ON c.id = cp.course_id
      WHERE c.is_active = true
      GROUP BY c.id, u.full_name
      ORDER BY enrollment_count DESC, c.created_at DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  },

  // Get all unique categories
  getCategories: async () => {
    const query = `
      SELECT DISTINCT category 
      FROM courses 
      WHERE category IS NOT NULL AND is_active = true
      ORDER BY category
    `;

    const result = await pool.query(query);
    return result.rows.map((row) => row.category);
  },

  // Check if teacher owns course
  isTeacherOwner: async (courseId, teacherId) => {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM courses 
        WHERE id = $1 AND teacher_id = $2
      ) as is_owner
    `;

    const result = await pool.query(query, [courseId, teacherId]);
    return result.rows[0].is_owner;
  },
};

module.exports = courseModel;
