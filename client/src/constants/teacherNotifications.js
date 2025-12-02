// Teacher Notification Quick Reference
// This file documents all notification types teachers receive

export const TEACHER_NOTIFICATION_TYPES = {
  // === PERSISTENT NOTIFICATIONS (Stored in Database) ===

  // Course Purchase & Enrollment
  COURSE_PURCHASE_REQUEST: {
    type: "course_purchase_approval_request",
    title: "Course Enrollment Approval Needed 📋",
    description: "Student wants to enroll in your course",
    persistent: true,
    actions: ["Approve", "Reject"],
    data: {
      courseId: "string",
      customerId: "string",
      purchaseId: "string",
      userId: "string (teacher)",
    },
  },

  COURSE_PURCHASED: {
    type: "course_purchased",
    title: "Course Purchased! 🎓",
    description: "Student purchased your course",
    persistent: true,
    actions: ["View Details"],
    data: {
      courseId: "string",
      customerId: "string",
      purchaseId: "string",
      userId: "string (teacher)",
    },
  },

  STUDENT_ENROLLED: {
    type: "course_enrollment_approved",
    title: "Student Enrolled! ✅",
    description: "You approved a student enrollment",
    persistent: true,
    actions: ["View Student", "View Course"],
    data: {
      courseId: "string",
      customerId: "string",
      purchaseId: "string",
      userId: "string (teacher)",
    },
  },

  ENROLLMENT_REJECTED: {
    type: "course_enrollment_rejected",
    title: "Enrollment Request Rejected ❌",
    description: "You rejected a student enrollment",
    persistent: true,
    actions: ["View Details"],
    data: {
      courseId: "string",
      customerId: "string",
      purchaseId: "string",
      userId: "string (teacher)",
    },
  },

  // Course Management
  COURSE_UPDATED: {
    type: "course_updated",
    title: "Course Updated Successfully! 📝",
    description: "Your course has been updated",
    persistent: true,
    actions: ["View Course"],
    data: {
      courseId: "string",
      userId: "string (teacher)",
    },
  },

  COURSE_DELETED: {
    type: "course_deleted",
    title: "Course Deleted 🗑️",
    description: "Your course has been deleted",
    persistent: true,
    actions: ["View History"],
    data: {
      courseId: "string",
      userId: "string (teacher)",
    },
  },

  // === TRANSIENT NOTIFICATIONS (Not Stored in Database) ===

  WELCOME: {
    type: "welcome",
    title: "Welcome Teacher! 👨‍🏫",
    description: "Welcome message on login",
    persistent: false,
    actions: [],
    data: {
      role: "teacher",
    },
  },
};

// Notification Filtering Examples
export const getTeacherNotifications = (notifications) => {
  const persistent = notifications.filter((n) =>
    [
      "course_purchase_approval_request",
      "course_purchased",
      "course_enrollment_approved",
      "course_enrollment_rejected",
      "course_updated",
      "course_deleted",
    ].includes(n.type)
  );

  return persistent;
};

// Get notifications requiring action
export const getActionableNotifications = (notifications) => {
  return notifications.filter(
    (n) => n.type === "course_purchase_approval_request" && !n.is_read
  );
};

// Get course-related notifications
export const getCourseNotifications = (notifications, courseId) => {
  return notifications.filter((n) => n.data?.courseId === courseId.toString());
};

// Get purchase-related notifications
export const getPurchaseNotifications = (notifications) => {
  return notifications.filter(
    (n) => n.type.includes("purchase") || n.type.includes("enrollment")
  );
};

// Notification Priority
export const NOTIFICATION_PRIORITY = {
  HIGH: ["course_purchase_approval_request"],
  MEDIUM: [
    "course_purchased",
    "course_enrollment_approved",
    "course_enrollment_rejected",
  ],
  LOW: ["course_updated", "course_deleted"],
};

// Get notifications by priority
export const getHighPriorityNotifications = (notifications) => {
  return notifications.filter(
    (n) => NOTIFICATION_PRIORITY.HIGH.includes(n.type) && !n.is_read
  );
};
