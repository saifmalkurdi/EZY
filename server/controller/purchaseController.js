const purchaseModel = require("../model/purchaseModel");
const ora = require("ora");
const planModel = require("../model/planModel");
const courseModel = require("../model/courseModel");
const userModel = require("../model/userModel");
const notificationModel = require("../model/notificationModel");
const {
  sendNotification,
  sendMulticastNotification,
  notifications,
} = require("../services/firebaseService");

const purchaseController = {
  // Purchase a plan (Customer)
  purchasePlan: async (req, res) => {
    try {
      const { plan_id } = req.body;

      if (!plan_id) {
        return res.status(400).json({
          success: false,
          message: "Plan ID is required",
        });
      }

      // Check if plan exists and is active
      const plan = await planModel.findById(plan_id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found",
        });
      }

      if (!plan.is_active) {
        return res.status(400).json({
          success: false,
          message: "This plan is not available for purchase",
        });
      }

      // Check if already purchased or has pending request
      const hasPurchased = await purchaseModel.hasPurchasedPlan(
        req.user.id,
        plan_id
      );
      if (hasPurchased) {
        return res.status(400).json({
          success: false,
          message:
            "You can't purchase this plan twice. You either already have this plan or have a pending request.",
        });
      }

      // Create purchase with expiration date
      const purchase = await purchaseModel.purchasePlan(
        req.user.id,
        plan_id,
        plan.price,
        plan.duration_days
      );

      // Send notifications
      try {
        // Notify admins about approval request
        const adminTokens = await userModel.getFcmTokensByRole("admin");
        const adminIds = await userModel.getUserIdsByRole("admin");
        if (adminTokens.length > 0) {
          await sendMulticastNotification(
            adminTokens,
            notifications.planPurchaseApprovalRequest(
              plan.title,
              req.user.full_name
            ),
            {
              type: "plan_purchase_approval_request",
              planId: plan_id.toString(),
              userId: req.user.id.toString(),
              purchaseId: purchase.id.toString(),
            },
            adminIds
          );
        }
      } catch (notifyErr) {
        // Silent fail on notification error
      }

      res.status(201).json({
        success: true,
        message:
          "Request submitted successfully! Waiting for admin approval to activate your plan.",
        data: {
          ...purchase,
          status: "pending_approval",
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to purchase plan",
      });
    }
  },

  // Purchase a course (Customer)
  purchaseCourse: async (req, res) => {
    try {
      const { course_id } = req.body;

      if (!course_id) {
        return res.status(400).json({
          success: false,
          message: "Course ID is required",
        });
      }

      // Check course purchase limit (max 5 active courses)
      const purchaseCount = await purchaseModel.getUserCoursePurchaseCount(
        req.user.id
      );
      if (purchaseCount >= 5) {
        return res.status(400).json({
          success: false,
          message:
            "You have reached the maximum limit of 5 active course purchases. Please wait for a course to expire before purchasing a new one.",
        });
      }

      // Check if course exists and is active
      const course = await courseModel.findById(course_id);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      if (!course.is_active) {
        return res.status(400).json({
          success: false,
          message: "This course is not available for purchase",
        });
      }

      // Check if already purchased or has pending request
      const hasPurchased = await purchaseModel.hasPurchasedCourse(
        req.user.id,
        course_id
      );
      if (hasPurchased) {
        return res.status(400).json({
          success: false,
          message:
            "You can't enroll in this course twice. You either already have access or have a pending enrollment request.",
        });
      }

      // Create purchase (database trigger will enforce 5 active course limit)
      const purchase = await purchaseModel.purchaseCourse(
        req.user.id,
        course_id,
        course.price,
        course.duration_days
      );

      // Send notifications
      try {
        // Notify the course teacher about approval request AND purchase
        if (course.teacher_id) {
          const teacherToken = await userModel.getFcmToken(course.teacher_id);

          // Send FCM notification if token exists (sendNotification saves to DB automatically)
          if (teacherToken) {
            await sendNotification(
              teacherToken,
              notifications.coursePurchaseApprovalRequest(
                course.title,
                req.user.full_name
              ),
              {
                type: "course_purchase_approval_request",
                courseId: course_id.toString(),
                userId: course.teacher_id.toString(),
                customerId: req.user.id.toString(),
                purchaseId: purchase.id.toString(),
              }
            );

            // Also send a notification about the purchase itself
            await sendNotification(
              teacherToken,
              notifications.coursePurchased(course.title, req.user.full_name),
              {
                type: "course_purchased",
                courseId: course_id.toString(),
                userId: course.teacher_id.toString(),
                customerId: req.user.id.toString(),
                purchaseId: purchase.id.toString(),
              }
            );
          }
        }

        // Also notify admins about the purchase
        const adminTokens = await userModel.getFcmTokensByRole("admin");
        const adminIds = await userModel.getUserIdsByRole("admin");
        if (adminTokens.length > 0) {
          await sendMulticastNotification(
            adminTokens,
            notifications.coursePurchaseApprovalRequest(
              course.title,
              req.user.full_name
            ),
            {
              type: "course_purchase_approval_request",
              courseId: course_id.toString(),
              userId: req.user.id.toString(),
              purchaseId: purchase.id.toString(),
            },
            adminIds
          );
        }
      } catch (notifyErr) {
        // Silent fail on notification error
      }

      res.status(201).json({
        success: true,
        message:
          "Enrollment request submitted successfully! Waiting for teacher approval to access the course.",
        data: {
          ...purchase,
          status: "pending_approval",
        },
      });
    } catch (error) {
      if (
        error.message &&
        error.message.includes("maximum limit of 5 active course purchases")
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to purchase course",
      });
    }
  },

  // Get my plan purchases (Customer)
  getMyPlans: async (req, res) => {
    try {
      const plans = await purchaseModel.getUserPlanPurchases(req.user.id);

      res.status(200).json({
        success: true,
        data: plans,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch your plans",
      });
    }
  },

  // Get my purchased courses (Customer)
  getMyCourses: async (req, res) => {
    try {
      const courses = await purchaseModel.getMyCourses(req.user.id);

      res.status(200).json({
        success: true,
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch your courses",
      });
    }
  },

  // Get my pending course purchases (Customer)
  getMyPendingCourses: async (req, res) => {
    try {
      const courses = await purchaseModel.getUserPendingCoursePurchases(
        req.user.id
      );

      res.status(200).json({
        success: true,
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch pending course requests",
      });
    }
  },

  // Get my pending plan purchases (Customer)
  getMyPendingPlans: async (req, res) => {
    try {
      const plans = await purchaseModel.getUserPendingPlanPurchases(
        req.user.id
      );

      res.status(200).json({
        success: true,
        data: plans,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch pending plan requests",
      });
    }
  },

  // Get all purchases (Admin)
  getAllPurchases: async (req, res) => {
    try {
      const { user_id, limit, offset } = req.query;

      const filters = {};
      if (user_id) filters.user_id = user_id;
      if (limit) filters.limit = parseInt(limit);
      if (offset) filters.offset = parseInt(offset);

      const purchases = await purchaseModel.getAllPurchases(filters);

      res.status(200).json({
        success: true,
        data: purchases,
      });
    } catch (error) {
      spinner.fail("Failed to fetch purchases ❌");
      await new Promise((resolve) => setTimeout(resolve, 500));

      res.status(500).json({
        success: false,
        message: "Failed to fetch purchases",
      });
    }
  },

  // Get purchase statistics (Admin)
  getPurchaseStats: async (req, res) => {
    try {
      const [planStats, courseStats] = await Promise.all([
        purchaseModel.getPlanStats(),
        purchaseModel.getCourseStats(),
      ]);

      res.status(200).json({
        success: true,
        data: {
          plans: planStats,
          courses: courseStats,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch purchase statistics",
      });
    }
  },

  // Get my revenue (Teacher only)
  getMyRevenue: async (req, res) => {
    try {
      const revenue = await purchaseModel.getTeacherRevenue(req.user.id);

      res.status(200).json({
        success: true,
        data: revenue,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch your revenue",
      });
    }
  },

  // Get pending plan purchases (Admin only)
  getPendingPlanPurchases: async (req, res) => {
    try {
      const purchases = await purchaseModel.getPendingPlanPurchases();

      res.status(200).json({
        success: true,
        data: purchases,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch pending plan purchases",
      });
    }
  },

  // Get pending course purchases (Teacher and Admin)
  getPendingCoursePurchases: async (req, res) => {
    try {
      let purchases;

      // If admin, get all pending course purchases
      if (req.user.role === "admin") {
        purchases = await purchaseModel.getAllPendingCoursePurchases();
      } else {
        // If teacher, get only their pending course purchases
        purchases = await purchaseModel.getPendingCoursePurchasesForTeacher(
          req.user.id
        );
      }

      res.status(200).json({
        success: true,
        data: purchases,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch pending course purchases",
      });
    }
  },

  // Approve plan purchase (Admin only)
  approvePlanPurchase: async (req, res) => {
    try {
      const { purchase_id } = req.params;

      const purchase = await purchaseModel.getPlanPurchaseById(purchase_id);
      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "Purchase not found",
        });
      }

      if (purchase.approval_status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Purchase has already been processed",
        });
      }

      const approved = await purchaseModel.approvePlanPurchase(
        purchase_id,
        req.user.id
      );

      // Notify the customer
      try {
        const userToken = await userModel.getFcmToken(purchase.customer_id);
        if (userToken) {
          await sendNotification(
            userToken,
            notifications.planPurchaseApproved(purchase.plan_title),
            {
              type: "plan_purchase_approved",
              planId: purchase.plan_id.toString(),
              purchaseId: purchase_id.toString(),
              userId: purchase.customer_id.toString(),
            }
          );
        }
      } catch (notifyErr) {
        // Silent fail
      }

      res.status(200).json({
        success: true,
        message: "Plan purchase approved successfully",
        data: approved,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to approve plan purchase",
      });
    }
  },

  // Reject plan purchase (Admin only)
  rejectPlanPurchase: async (req, res) => {
    try {
      const { purchase_id } = req.params;

      const purchase = await purchaseModel.getPlanPurchaseById(purchase_id);
      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "Purchase not found",
        });
      }

      if (purchase.approval_status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Purchase has already been processed",
        });
      }

      const rejected = await purchaseModel.rejectPlanPurchase(
        purchase_id,
        req.user.id
      );

      // Notify the customer
      try {
        const userToken = await userModel.getFcmToken(purchase.customer_id);
        if (userToken) {
          await sendNotification(
            userToken,
            notifications.planPurchaseRejected(purchase.plan_title),
            {
              type: "plan_purchase_rejected",
              planId: purchase.plan_id.toString(),
              purchaseId: purchase_id.toString(),
              userId: purchase.customer_id.toString(),
            }
          );
        }
      } catch (notifyErr) {
        // Silent fail
      }

      res.status(200).json({
        success: true,
        message: "Plan purchase rejected",
        data: rejected,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to reject plan purchase",
      });
    }
  },

  // Approve course purchase (Teacher only)
  approveCoursePurchase: async (req, res) => {
    try {
      const { purchase_id } = req.params;

      const purchase = await purchaseModel.getCoursePurchaseById(purchase_id);
      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "Purchase not found",
        });
      }

      // Check if the teacher owns the course (admins can approve any course)
      if (req.user.role !== "admin" && purchase.teacher_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can only approve purchases for your own courses",
        });
      }

      if (purchase.approval_status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Purchase has already been processed",
        });
      }

      const approved = await purchaseModel.approveCoursePurchase(
        purchase_id,
        req.user.id
      );

      // Notify the customer
      try {
        const userToken = await userModel.getFcmToken(purchase.customer_id);
        if (userToken) {
          await sendNotification(
            userToken,
            notifications.coursePurchaseApproved(purchase.course_title),
            {
              type: "course_purchase_approved",
              courseId: purchase.course_id.toString(),
              purchaseId: purchase_id.toString(),
              userId: purchase.customer_id.toString(),
            }
          );
        }

        // Notify the teacher about approved purchase - save to database
        if (purchase.teacher_id) {
          const teacherToken = await userModel.getFcmToken(purchase.teacher_id);
          if (teacherToken) {
            await sendNotification(
              teacherToken,
              {
                title: "Student Enrolled! ✅",
                body: `${
                  purchase.customer_name || "A student"
                } has been enrolled in "${purchase.course_title}".`,
              },
              {
                type: "course_enrollment_approved",
                courseId: purchase.course_id.toString(),
                purchaseId: purchase_id.toString(),
                customerId: purchase.customer_id.toString(),
                userId: purchase.teacher_id.toString(),
              }
            );
          }
        }
      } catch (notifyErr) {
        // Silent fail
      }

      res.status(200).json({
        success: true,
        message: "Course enrollment approved successfully",
        data: approved,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to approve course purchase",
      });
    }
  },

  // Reject course purchase (Teacher only)
  rejectCoursePurchase: async (req, res) => {
    try {
      const { purchase_id } = req.params;

      const purchase = await purchaseModel.getCoursePurchaseById(purchase_id);
      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "Purchase not found",
        });
      }

      // Check if the teacher owns the course (admins can reject any course)
      if (req.user.role !== "admin" && purchase.teacher_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You can only reject purchases for your own courses",
        });
      }

      if (purchase.approval_status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Purchase has already been processed",
        });
      }

      const rejected = await purchaseModel.rejectCoursePurchase(
        purchase_id,
        req.user.id
      );

      // Notify the customer
      try {
        const userToken = await userModel.getFcmToken(purchase.customer_id);
        if (userToken) {
          await sendNotification(
            userToken,
            notifications.coursePurchaseRejected(purchase.course_title),
            {
              type: "course_purchase_rejected",
              courseId: purchase.course_id.toString(),
              purchaseId: purchase_id.toString(),
              userId: purchase.customer_id.toString(),
            }
          );
        }

        // Notify the teacher about rejected purchase - save to database
        if (purchase.teacher_id) {
          const teacherToken = await userModel.getFcmToken(purchase.teacher_id);
          if (teacherToken) {
            await sendNotification(
              teacherToken,
              {
                title: "Enrollment Request Rejected ❌",
                body: `You rejected ${
                  purchase.customer_name || "a student"
                }'s request to enroll in "${purchase.course_title}".`,
              },
              {
                type: "course_enrollment_rejected",
                courseId: purchase.course_id.toString(),
                purchaseId: purchase_id.toString(),
                customerId: purchase.customer_id.toString(),
                userId: purchase.teacher_id.toString(),
              }
            );
          }
        }
      } catch (notifyErr) {
        // Silent fail
      }

      res.status(200).json({
        success: true,
        message: "Course enrollment rejected",
        data: rejected,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to reject course purchase",
      });
    }
  },
};

module.exports = purchaseController;
