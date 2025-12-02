const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Flatten array in case roles passed as array
    const roles = allowedRoles.flat();

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const isAdmin = authorizeRole("admin");

// Middleware to check if user is teacher
const isTeacher = authorizeRole("teacher");

// Middleware to check if user is customer
const isCustomer = authorizeRole("customer");

// Middleware to check if user is teacher or admin
const isTeacherOrAdmin = authorizeRole("teacher", "admin");

// Middleware to check if user is customer or admin
const isCustomerOrAdmin = authorizeRole("customer", "admin");

module.exports = {
  isAdmin,
  isTeacher,
  isCustomer,
  isTeacherOrAdmin,
  isCustomerOrAdmin,
  authorizeRole,
};
