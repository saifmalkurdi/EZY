const courseModel = require("../model/courseModel");
const ora = require("ora");
const userModel = require("../model/userModel");
const purchaseModel = require("../model/purchaseModel");
const notificationModel = require("../model/notificationModel");
const {
  sendNotification,
  sendMulticastNotification,
  notifications,
} = require("../services/firebaseService");
const fs = require("fs");
const path = require("path");

const courseController = {
  // Upload image endpoint (separate endpoint for flexibility)
  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      const imageUrl = `/uploads/courses/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: imageUrl,
          filename: req.file.filename,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error: error.message,
      });
    }
  },

  // Create a new course (Teacher only)
  createCourse: async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        duration,
        duration_days,
        level,
        category,
        icon,
        thumbnail_url,
        objectives,
        curriculum,
        tools,
        is_active,
      } = req.body;

      // Validate required fields
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      if (!description) {
        return res.status(400).json({
          success: false,
          message: "Description is required",
        });
      }

      if (price === undefined || price === null || isNaN(price)) {
        return res.status(400).json({
          success: false,
          message: "Valid price is required",
        });
      }

      if (price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be non-negative",
        });
      }

      if (!duration) {
        return res.status(400).json({
          success: false,
          message: "Duration is required",
        });
      }

      if (!level) {
        return res.status(400).json({
          success: false,
          message: "Level is required",
        });
      }

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Category is required",
        });
      }

      // Validate level
      const validLevels = ["beginner", "intermediate", "advanced"];
      if (!validLevels.includes(level.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Level must be beginner, intermediate, or advanced",
        });
      }

      // Convert level to proper case for database
      const levelFormatted =
        level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();

      // Handle thumbnail: either uploaded file or URL
      let thumbnailPath = thumbnail_url || null;
      if (req.file) {
        thumbnailPath = `/uploads/courses/${req.file.filename}`;
      }

      const course = await courseModel.create({
        teacher_id: req.user.id,
        title,
        description,
        price,
        duration,
        duration_days: duration_days || 30,
        level: levelFormatted,
        category,
        icon,
        thumbnail_url: thumbnailPath,
        objectives: objectives || [],
        curriculum: curriculum || [],
        tools: tools || [],
        is_active,
      });

      // Notify admins, teacher, and students about new course
      try {
        // Notify admins
        const adminTokens = await userModel.getFcmTokensByRole("admin");
        const adminIds = await userModel.getUserIdsByRole("admin");
        if (adminTokens.length > 0) {
          await sendMulticastNotification(
            adminTokens,
            notifications.courseCreated(title),
            {
              type: "course_created",
              courseId: course.id.toString(),
              teacherId: req.user.id.toString(),
            },
            adminIds
          );
        }

        // Send notification to teacher (saves to DB automatically)
        const teacherToken = await userModel.getFcmToken(req.user.id);
        if (teacherToken) {
          await sendNotification(
            teacherToken,
            {
              title: "Course Created Successfully! 🎓",
              body: `Your course "${title}" has been created and is now live.`,
            },
            {
              type: "course_created",
              courseId: course.id.toString(),
              userId: req.user.id.toString(),
            }
          );
        }

        // Notify students who have bought from this teacher before
        const studentIds = await purchaseModel.getTeacherStudents(req.user.id);
        if (studentIds.length > 0) {
          const studentTokens = [];
          for (const studentId of studentIds) {
            const token = await userModel.getFcmToken(studentId);
            if (token) studentTokens.push(token);
          }
          if (studentTokens.length > 0) {
            await sendMulticastNotification(
              studentTokens,
              notifications.courseCreated(title),
              {
                type: "new_course_from_teacher",
                courseId: course.id.toString(),
                teacherId: req.user.id.toString(),
              },
              studentIds
            );
          }
        }
      } catch (notifyErr) {
        // Silent fail on notification error
      }

      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: course,
      });
    } catch (error) {
      console.error("Update course error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update course",
        error: error.message,
      });
    }
  },

  // Get all courses (Public)
  getAllCourses: async (req, res) => {
    try {
      const { is_active, category, level, search, limit, offset } = req.query;

      const filters = {};
      if (is_active !== undefined) filters.is_active = is_active === "true";
      if (category) filters.category = category;
      if (level) filters.level = level.toLowerCase();
      if (search) filters.search = search;
      if (limit) filters.limit = parseInt(limit);
      if (offset) filters.offset = parseInt(offset);

      const { courses, total } = await courseModel.findAll(filters);

      res.status(200).json({
        success: true,
        data: courses,
        total: total,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch courses",
      });
    }
  },

  // Get course by ID (Public)
  getCourseById: async (req, res) => {
    try {
      const { id } = req.params;

      if (isNaN(id) || !Number.isInteger(Number(id))) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID. Must be a number.",
        });
      }

      const course = await courseModel.findById(id);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      res.status(200).json({
        success: true,
        data: course,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch course",
        error: error.message,
      });
    }
  },

  // Update course (Teacher - own courses only)
  updateCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        price,
        duration,
        duration_days,
        level,
        category,
        icon,
        thumbnail_url,
        objectives,
        curriculum,
        tools,
        is_active,
      } = req.body;

      // Check if teacher owns this course
      const isOwner = await courseModel.isTeacherOwner(id, req.user.id);

      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own courses",
        });
      }
      if (price !== undefined && price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be non-negative",
        });
      }

      if (duration !== undefined && duration <= 0) {
        return res.status(400).json({
          success: false,
          message: "Duration must be positive",
        });
      }

      if (level) {
        const validLevels = ["beginner", "intermediate", "advanced"];
        if (!validLevels.includes(level.toLowerCase())) {
          return res.status(400).json({
            success: false,
            message: "Level must be beginner, intermediate, or advanced",
          });
        }
      }

      const levelFormatted = level
        ? level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
        : undefined;

      // Handle thumbnail: either uploaded file or URL
      let thumbnailPath = thumbnail_url;
      if (req.file) {
        thumbnailPath = `/uploads/courses/${req.file.filename}`;

        // Delete old thumbnail if it exists and is a local file
        const oldCourse = await courseModel.findById(id);
        if (
          oldCourse &&
          oldCourse.thumbnail_url &&
          oldCourse.thumbnail_url.startsWith("/uploads/")
        ) {
          const oldFilePath = path.join(
            __dirname,
            "..",
            oldCourse.thumbnail_url
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
      }

      const course = await courseModel.update(id, {
        title,
        description,
        price,
        duration,
        duration_days,
        level: levelFormatted,
        category,
        icon,
        thumbnail_url: thumbnailPath,
        objectives,
        curriculum,
        tools,
        is_active,
      });

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      try {
        // Notify students about course update
        const studentIds = await purchaseModel.getCourseStudents(id);
        if (studentIds.length > 0) {
          const studentTokens = [];
          for (const studentId of studentIds) {
            const token = await userModel.getFcmToken(studentId);
            if (token) studentTokens.push(token);
          }
          if (studentTokens.length > 0) {
            await sendMulticastNotification(
              studentTokens,
              notifications.courseUpdated(course.title),
              {
                type: "course_updated",
                courseId: id.toString(),
              },
              studentIds
            );
          }
        }

        // Notify the teacher about their course update
        const teacherToken = await userModel.getFcmToken(req.user.id);
        if (teacherToken) {
          await sendNotification(
            teacherToken,
            {
              title: "Course Updated Successfully! 📝",
              body: `Your course "${course.title}" has been updated.`,
            },
            {
              type: "course_updated",
              courseId: id.toString(),
              userId: req.user.id.toString(),
            }
          );
        }
      } catch (notifyErr) {
        // Silent fail on notification error
      }

      res.status(200).json({
        success: true,
        message: "Course updated successfully",
        data: course,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update course",
      });
    }
  },

  // Delete course (Teacher/Admin)
  deleteCourse: async (req, res) => {
    try {
      const { id } = req.params;

      if (req.user.role !== "admin") {
        const isOwner = await courseModel.isTeacherOwner(id, req.user.id);
        if (!isOwner) {
          return res.status(403).json({
            success: false,
            message: "You can only delete your own courses",
          });
        }
      }

      const course = await courseModel.delete(id);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      try {
        const adminTokens = await userModel.getFcmTokensByRole("admin");
        const adminIds = await userModel.getUserIdsByRole("admin");
        if (adminTokens.length > 0) {
          await sendMulticastNotification(
            adminTokens,
            notifications.systemUpdate(
              `Course deleted: ${course.title} by ${req.user.full_name}`
            ),
            {
              type: "course_deleted",
              courseId: id.toString(),
            },
            adminIds
          );
        }

        // Notify the teacher about their course deletion (only if not admin)
        if (req.user.role !== "admin") {
          const teacherToken = await userModel.getFcmToken(req.user.id);
          if (teacherToken) {
            await sendNotification(
              teacherToken,
              {
                title: "Course Deleted 🗑️",
                body: `Your course "${course.title}" has been deleted.`,
              },
              {
                type: "course_deleted",
                courseId: id.toString(),
                userId: req.user.id.toString(),
              }
            );
          }
        }
      } catch (notifyErr) {
        // Silent fail on notification error
      }

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
        data: course,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete course",
      });
    }
  },

  // Get my courses (Teacher)
  getMyCourses: async (req, res) => {
    try {
      const { search, limit, offset } = req.query;

      const filters = {
        teacher_id: req.user.id,
      };

      if (search) filters.search = search;
      if (limit) filters.limit = parseInt(limit);
      if (offset) filters.offset = parseInt(offset);

      const { courses, total } = await courseModel.findAll(filters);

      res.status(200).json({
        success: true,
        data: courses,
        total: total,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch your courses",
      });
    }
  },

  // Get my course statistics (Teacher)
  getMyStats: async (req, res) => {
    const spinner = ora("Fetching your course statistics...").start();
    try {
      const stats = await courseModel.getTeacherStats(req.user.id);

      spinner.succeed("Course statistics retrieved 📊");
      await new Promise((resolve) => setTimeout(resolve, 500));

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      spinner.fail("Failed to fetch your statistics ❌");
      await new Promise((resolve) => setTimeout(resolve, 500));

      res.status(500).json({
        success: false,
        message: "Failed to fetch your statistics",
      });
    }
  },

  // Get all categories (Public)
  getCategories: async (req, res) => {
    try {
      const categories = await courseModel.getCategories();

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
      });
    }
  },

  // Get most popular courses (Public)
  getMostPopular: async (req, res) => {
    try {
      const { limit = 10 } = req.query;

      const courses = await courseModel.getMostPopular(parseInt(limit));

      res.status(200).json({
        success: true,
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch popular courses",
      });
    }
  },

  // Toggle course active status (Teacher only)
  toggleCourseStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      if (is_active === undefined) {
        return res.status(400).json({
          success: false,
          message: "is_active field is required",
        });
      }

      // Verify the course belongs to the teacher
      const course = await courseModel.findById(id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      if (course.teacher_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can only modify your own courses",
        });
      }

      const updated = await courseModel.update(id, { is_active });

      try {
        // Notify the teacher about course status change (sendNotification saves to DB)
        const teacherToken = await userModel.getFcmToken(req.user.id);
        if (teacherToken) {
          await sendNotification(
            teacherToken,
            {
              title: `Course ${is_active ? "Activated" : "Deactivated"} ${
                is_active ? "✅" : "⏸️"
              }`,
              body: `Your course "${course.title}" has been ${
                is_active
                  ? "activated and is now visible to students"
                  : "deactivated and is no longer visible to students"
              }.`,
            },
            {
              type: `course_${is_active ? "activated" : "deactivated"}`,
              courseId: id.toString(),
              userId: req.user.id.toString(),
              isActive: is_active,
            }
          );
        }
      } catch (notifyErr) {
        // Silent fail on notification error
      }

      res.status(200).json({
        success: true,
        message: `Course ${
          is_active ? "activated" : "deactivated"
        } successfully`,
        data: updated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update course status",
      });
    }
  },
};

module.exports = courseController;
