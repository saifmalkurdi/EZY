const express = require("express");
const router = express.Router();
const purchaseController = require("../controller/purchaseController");
const authenticateToken = require("../middleware/auth");
const {
  isCustomer,
  isAdmin,
  isTeacherOrAdmin,
} = require("../middleware/roleMiddleware");

// Customer routes
router.post(
  "/plan",
  authenticateToken,
  isCustomer,
  purchaseController.purchasePlan
);
router.post(
  "/course",
  authenticateToken,
  isCustomer,
  purchaseController.purchaseCourse
);
router.get(
  "/my/plans",
  authenticateToken,
  isCustomer,
  purchaseController.getMyPlans
);
router.get(
  "/my/courses",
  authenticateToken,
  isCustomer,
  purchaseController.getMyCourses
);
router.get(
  "/my/pending/plans",
  authenticateToken,
  isCustomer,
  purchaseController.getMyPendingPlans
);
router.get(
  "/my/pending/courses",
  authenticateToken,
  isCustomer,
  purchaseController.getMyPendingCourses
);

// Teacher routes
router.get(
  "/my/revenue",
  authenticateToken,
  isTeacherOrAdmin,
  purchaseController.getMyRevenue
);
router.get(
  "/pending/courses",
  authenticateToken,
  isTeacherOrAdmin,
  purchaseController.getPendingCoursePurchases
);
router.put(
  "/course/:purchase_id/approve",
  authenticateToken,
  isTeacherOrAdmin,
  purchaseController.approveCoursePurchase
);
router.put(
  "/course/:purchase_id/reject",
  authenticateToken,
  isTeacherOrAdmin,
  purchaseController.rejectCoursePurchase
);

// Admin routes
router.get(
  "/all",
  authenticateToken,
  isAdmin,
  purchaseController.getAllPurchases
);
router.get(
  "/stats",
  authenticateToken,
  isAdmin,
  purchaseController.getPurchaseStats
);
router.get(
  "/pending/plans",
  authenticateToken,
  isAdmin,
  purchaseController.getPendingPlanPurchases
);
router.put(
  "/plan/:purchase_id/approve",
  authenticateToken,
  isAdmin,
  purchaseController.approvePlanPurchase
);
router.put(
  "/plan/:purchase_id/reject",
  authenticateToken,
  isAdmin,
  purchaseController.rejectPlanPurchase
);

module.exports = router;
