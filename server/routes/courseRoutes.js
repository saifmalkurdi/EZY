const express = require("express");
const router = express.Router();
const courseController = require("../controller/courseController");
const authenticateToken = require("../middleware/auth");
const { isTeacher, isTeacherOrAdmin } = require("../middleware/roleMiddleware");
const upload = require("../config/multer");

// Public routes
router.get("/", courseController.getAllCourses);
router.get("/categories", courseController.getCategories);
router.get("/popular", courseController.getMostPopular);

// Teacher only routes - MUST come before /:id to prevent route conflicts
router.post(
  "/",
  authenticateToken,
  isTeacher,
  upload.single("thumbnail"),
  courseController.createCourse
);
router.post(
  "/upload-image",
  authenticateToken,
  isTeacher,
  upload.single("image"),
  courseController.uploadImage
);
router.get(
  "/my/courses",
  authenticateToken,
  isTeacher,
  courseController.getMyCourses
);
router.get(
  "/my/stats",
  authenticateToken,
  isTeacher,
  courseController.getMyStats
);
router.put(
  "/:id",
  authenticateToken,
  isTeacher,
  upload.single("thumbnail"),
  courseController.updateCourse
);
router.patch(
  "/:id/toggle-status",
  authenticateToken,
  isTeacher,
  courseController.toggleCourseStatus
);

// Public route - comes after specific routes to avoid conflicts
router.get("/:id", courseController.getCourseById);

// Teacher or Admin routes
router.delete(
  "/:id",
  authenticateToken,
  isTeacherOrAdmin,
  courseController.deleteCourse
);

module.exports = router;
