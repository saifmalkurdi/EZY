const pool = require("../config/database");

const purchaseModel = {
  // Purchase a plan
  purchasePlan: async (userId, planId, amountPaid, durationDays) => {
    const query = `
      INSERT INTO plan_purchases (customer_id, plan_id, amount_paid, payment_status, approval_status, expires_at)
      VALUES ($1, $2, $3, 'completed', 'pending', CURRENT_TIMESTAMP + INTERVAL '1 day' * $4)
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId,
      planId,
      amountPaid,
      durationDays,
    ]);
    return result.rows[0];
  },

  // Purchase a course (enforces 5 active course limit via database trigger)
  purchaseCourse: async (userId, courseId, amountPaid, durationDays = 30) => {
    const query = `
      INSERT INTO course_purchases (customer_id, course_id, amount_paid, payment_status, approval_status, expires_at)
      VALUES ($1, $2, $3, 'completed', 'pending', CURRENT_TIMESTAMP + INTERVAL '1 day' * $4)
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        userId,
        courseId,
        amountPaid,
        durationDays,
      ]);
      return result.rows[0];
    } catch (error) {
      // Check if error is from the 5 active course limit trigger
      if (
        error.message &&
        error.message.includes("maximum limit of 5 active course purchases")
      ) {
        throw new Error(
          "You have reached the maximum limit of 5 active course purchases. Please wait for a course to expire before purchasing a new one."
        );
      }
      throw error;
    }
  },

  // Get courses purchased by the customer (for dashboard)
  getMyCourses: async (userId) => {
    const query = `
      SELECT 
        cp.*, c.title, c.description, c.price, c.duration, c.duration_days, c.level, c.category, c.icon, c.thumbnail_url, c.is_active,
        u.full_name as teacher_name,
        CASE WHEN cp.expires_at > CURRENT_TIMESTAMP THEN false ELSE true END as is_expired
      FROM course_purchases cp
      JOIN courses c ON cp.course_id = c.id
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE cp.customer_id = $1
        AND c.is_active = true
        AND cp.approval_status = 'approved'
        AND cp.expires_at > CURRENT_TIMESTAMP
      ORDER BY cp.purchased_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Get user's plan purchases (only active, non-expired, approved)
  getUserPlanPurchases: async (userId) => {
    const query = `
      SELECT 
        pp.*,
        p.title,
        p.description,
        p.price,
        p.price_note,
        p.gst_note,
        p.features,
        p.button_text,
        p.duration_days,
        p.is_highlighted,
        p.is_active,
        CASE 
          WHEN pp.expires_at > CURRENT_TIMESTAMP THEN false
          ELSE true
        END as is_expired
      FROM plan_purchases pp
      JOIN plans p ON pp.plan_id = p.id
      WHERE pp.customer_id = $1
        AND p.is_active = true
        AND pp.approval_status = 'approved'
        AND pp.expires_at > CURRENT_TIMESTAMP
      ORDER BY pp.purchased_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Get user's course purchases (only approved)
  getUserCoursePurchases: async (userId) => {
    const query = `
      SELECT 
        cp.*,
        c.title,
        c.description,
        c.price,
        c.duration,
        c.duration_days,
        c.level,
        c.category,
        c.icon,
        c.is_active,
        u.full_name as teacher_name,
        CASE 
          WHEN cp.expires_at > CURRENT_TIMESTAMP THEN false
          ELSE true
        END as is_expired
      FROM course_purchases cp
      JOIN courses c ON cp.course_id = c.id
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE cp.customer_id = $1
        AND c.is_active = true
        AND cp.approval_status = 'approved'
        AND cp.expires_at > CURRENT_TIMESTAMP
      ORDER BY cp.purchased_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Get user's pending course purchases (waiting for approval)
  getUserPendingCoursePurchases: async (userId) => {
    const query = `
      SELECT 
        cp.*,
        c.title, c.thumbnail_url,
        c.description,
        c.price,
        c.duration,
        c.duration_days,
        c.level,
        c.category,
        c.icon,
        c.is_active,
        u.full_name as teacher_name
      FROM course_purchases cp
      JOIN courses c ON cp.course_id = c.id
      LEFT JOIN users u ON c.teacher_id = u.id
      WHERE cp.customer_id = $1
        AND cp.approval_status = 'pending'
      ORDER BY cp.purchased_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Get user's pending plan purchases (waiting for approval)
  getUserPendingPlanPurchases: async (userId) => {
    const query = `
      SELECT 
        pp.*,
        p.title,
        p.description,
        p.price,
        p.price_note,
        p.gst_note,
        p.features,
        p.button_text,
        p.duration_days,
        p.is_highlighted,
        p.is_active
      FROM plan_purchases pp
      JOIN plans p ON pp.plan_id = p.id
      WHERE pp.customer_id = $1
        AND pp.approval_status = 'pending'
      ORDER BY pp.purchased_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  // Check if user has purchased or requested a specific plan
  hasPurchasedPlan: async (userId, planId) => {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM plan_purchases pp
        JOIN plans p ON pp.plan_id = p.id
        WHERE pp.customer_id = $1 
          AND pp.plan_id = $2
          AND p.is_active = true
          AND pp.approval_status IN ('approved', 'pending')
      ) as has_purchased
    `;

    const result = await pool.query(query, [userId, planId]);
    return result.rows[0].has_purchased;
  },

  // Check if user has purchased or requested a specific course
  hasPurchasedCourse: async (userId, courseId) => {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM course_purchases cp
        JOIN courses c ON cp.course_id = c.id
        WHERE cp.customer_id = $1 
          AND cp.course_id = $2
          AND c.is_active = true
          AND cp.approval_status IN ('approved', 'pending')
      ) as has_purchased
    `;

    const result = await pool.query(query, [userId, courseId]);
    return result.rows[0].has_purchased;
  },

  // Get user's active course purchase count
  getUserCoursePurchaseCount: async (userId) => {
    const query = `
      SELECT COUNT(*) as count
      FROM course_purchases
      WHERE customer_id = $1
      AND payment_status = 'completed'
      AND approval_status = 'approved'
      AND expires_at > CURRENT_TIMESTAMP
    `;

    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  },

  // Get plan purchase statistics
  getPlanStats: async () => {
    const query = `
      SELECT 
        p.id,
        p.title,
        COUNT(pp.id) as purchase_count,
        COALESCE(SUM(p.price), 0) as total_revenue
      FROM plans p
      LEFT JOIN plan_purchases pp ON p.id = pp.plan_id
      GROUP BY p.id, p.title
      ORDER BY purchase_count DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  },

  // Get course purchase statistics
  getCourseStats: async () => {
    const query = `
      SELECT 
        c.id,
        c.title, c.thumbnail_url,
        u.full_name as teacher_name,
        COUNT(cp.id) as purchase_count,
        COALESCE(SUM(c.price), 0) as total_revenue
      FROM courses c
      LEFT JOIN course_purchases cp ON c.id = cp.course_id
      LEFT JOIN users u ON c.teacher_id = u.id
      GROUP BY c.id, c.title, u.full_name
      ORDER BY purchase_count DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  },

  // Get teacher's revenue from course sales
  getTeacherRevenue: async (teacherId) => {
    const query = `
      SELECT 
        COUNT(cp.id) as total_sales,
        COALESCE(SUM(cp.amount_paid), 0) as total_revenue
      FROM course_purchases cp
      JOIN courses c ON cp.course_id = c.id
      WHERE c.teacher_id = $1
        AND cp.approval_status = 'approved'
    `;

    const result = await pool.query(query, [teacherId]);
    return result.rows[0];
  },

  // Get all purchases (admin view)
  getAllPurchases: async (filters = {}) => {
    let query = `
      SELECT 
        'plan' as type,
        pp.id,
        pp.customer_id,
        u.full_name as user_name,
        u.email as user_email,
        pp.plan_id as item_id,
        p.title as item_name,
        p.price,
        pp.purchased_at
      FROM plan_purchases pp
      JOIN users u ON pp.customer_id = u.id
      JOIN plans p ON pp.plan_id = p.id
      
      UNION ALL
      
      SELECT 
        'course' as type,
        cp.id,
        cp.customer_id,
        u.full_name as user_name,
        u.email as user_email,
        cp.course_id as item_id,
        c.title as item_name,
        c.price,
        cp.purchased_at
      FROM course_purchases cp
      JOIN users u ON cp.customer_id = u.id
      JOIN courses c ON cp.course_id = c.id
    `;

    const params = [];
    let paramCount = 1;

    // Filter by user
    if (filters.user_id) {
      query += ` WHERE customer_id = $${paramCount}`;
      params.push(filters.user_id);
      paramCount++;
    }

    query += ` ORDER BY purchased_at DESC`;

    // Pagination
    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  // Delete plan purchase (admin only)
  deletePlanPurchase: async (id) => {
    const query = `DELETE FROM plan_purchases WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Delete course purchase (admin only)
  deleteCoursePurchase: async (id) => {
    const query = `DELETE FROM course_purchases WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  // Get student IDs who purchased a course
  getCourseStudents: async (courseId) => {
    const query = `
      SELECT DISTINCT customer_id 
      FROM course_purchases 
      WHERE course_id = $1 AND payment_status = 'completed'
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows.map((row) => row.customer_id);
  },

  // Approve plan purchase (Admin only)
  approvePlanPurchase: async (purchaseId, adminId) => {
    const query = `
      UPDATE plan_purchases 
      SET approval_status = 'approved', 
          approved_at = CURRENT_TIMESTAMP,
          approved_by = $2
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [purchaseId, adminId]);
    return result.rows[0];
  },

  // Reject plan purchase (Admin only)
  rejectPlanPurchase: async (purchaseId, adminId) => {
    const query = `
      UPDATE plan_purchases 
      SET approval_status = 'rejected', 
          approved_at = CURRENT_TIMESTAMP,
          approved_by = $2
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [purchaseId, adminId]);
    return result.rows[0];
  },

  // Approve course purchase (Teacher only)
  approveCoursePurchase: async (purchaseId, teacherId) => {
    const query = `
      UPDATE course_purchases 
      SET approval_status = 'approved', 
          approved_at = CURRENT_TIMESTAMP,
          approved_by = $2
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [purchaseId, teacherId]);
    return result.rows[0];
  },

  // Reject course purchase (Teacher only)
  rejectCoursePurchase: async (purchaseId, teacherId) => {
    const query = `
      UPDATE course_purchases 
      SET approval_status = 'rejected', 
          approved_at = CURRENT_TIMESTAMP,
          approved_by = $2
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [purchaseId, teacherId]);
    return result.rows[0];
  },

  // Get pending plan purchases for admin
  getPendingPlanPurchases: async () => {
    const query = `
      SELECT 
        pp.*,
        p.title as plan_title,
        u.full_name as customer_name,
        u.email as customer_email
      FROM plan_purchases pp
      JOIN plans p ON pp.plan_id = p.id
      JOIN users u ON pp.customer_id = u.id
      WHERE pp.approval_status = 'pending'
      ORDER BY pp.purchased_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Get pending course purchases for a teacher
  getPendingCoursePurchasesForTeacher: async (teacherId) => {
    const query = `
      SELECT 
        cp.*,
        c.title as course_title,
        u.full_name as customer_name,
        u.email as customer_email
      FROM course_purchases cp
      JOIN courses c ON cp.course_id = c.id
      JOIN users u ON cp.customer_id = u.id
      WHERE c.teacher_id = $1 
        AND cp.approval_status = 'pending'
      ORDER BY cp.purchased_at DESC
    `;
    const result = await pool.query(query, [teacherId]);
    return result.rows;
  },

  // Get all pending course purchases (for admins)
  getAllPendingCoursePurchases: async () => {
    const query = `
      SELECT 
        cp.*,
        c.title as course_title,
        c.teacher_id,
        t.full_name as teacher_name,
        u.full_name as customer_name,
        u.email as customer_email
      FROM course_purchases cp
      JOIN courses c ON cp.course_id = c.id
      JOIN users u ON cp.customer_id = u.id
      LEFT JOIN users t ON c.teacher_id = t.id
      WHERE cp.approval_status = 'pending'
      ORDER BY cp.purchased_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Get purchase by ID with details
  getPlanPurchaseById: async (purchaseId) => {
    const query = `
      SELECT 
        pp.*,
        p.title as plan_title,
        u.full_name as customer_name,
        u.email as customer_email
      FROM plan_purchases pp
      JOIN plans p ON pp.plan_id = p.id
      JOIN users u ON pp.customer_id = u.id
      WHERE pp.id = $1
    `;
    const result = await pool.query(query, [purchaseId]);
    return result.rows[0];
  },

  // Get course purchase by ID with details
  getCoursePurchaseById: async (purchaseId) => {
    const query = `
      SELECT
        cp.*,
        c.title as course_title,
        c.teacher_id,
        u.full_name as customer_name,
        u.email as customer_email
      FROM course_purchases cp
      JOIN courses c ON cp.course_id = c.id
      JOIN users u ON cp.customer_id = u.id
      WHERE cp.id = $1
    `;
    const result = await pool.query(query, [purchaseId]);
    return result.rows[0];
  },

  // Get all students who have bought any course from a teacher
  getTeacherStudents: async (teacherId) => {
    const query = `
      SELECT DISTINCT cp.customer_id
      FROM course_purchases cp
      JOIN courses c ON cp.course_id = c.id
      WHERE c.teacher_id = $1
        AND cp.payment_status = 'completed'
        AND cp.approval_status = 'approved'
    `;
    const result = await pool.query(query, [teacherId]);
    return result.rows.map((row) => row.customer_id);
  },
};

module.exports = purchaseModel;
