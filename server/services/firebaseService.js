const admin = require("firebase-admin");
const notificationModel = require("../model/notificationModel");
require("dotenv").config();

// Load Firebase Admin credentials from environment variables
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: "googleapis.com",
};

let messaging = null;
let isInitialized = false;

// Initialize Firebase Admin only if credentials are provided
if (serviceAccount.project_id && serviceAccount.private_key) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    messaging = admin.messaging();
    isInitialized = true;
  } catch (error) {}
}

const sendNotification = async (
  fcmToken,
  notification,
  data = {},
  options = {}
) => {
  const stringData = {};
  for (const key in data) {
    stringData[key] = String(data[key]);
  }

  // Always save notification to database if user_id is provided and not transient
  // This ensures notifications persist even if user is offline or FCM fails
  if (data.userId && !options.transient) {
    try {
      await notificationModel.create({
        user_id: data.userId,
        title: notification.title,
        message: notification.body,
        type: data.type || null,
        data: stringData,
      });
    } catch (dbError) {
      // Log error but continue to try FCM notification
    }
  }

  // Try to send FCM notification if token is available
  if (!messaging || !isInitialized || !fcmToken) {
    // Even if FCM fails, notification is already saved to database
    return null;
  }

  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: stringData,
    token: fcmToken,
  };

  try {
    const response = await messaging.send(message);
    return response;
  } catch (error) {
    // FCM failed but notification is already in database
    return null;
  }
};

const sendMulticastNotification = async (
  fcmTokens,
  notification,
  data = {},
  userIds = []
) => {
  if (!messaging || !isInitialized || !fcmTokens || fcmTokens.length === 0) {
    return null;
  }

  const stringData = {};
  for (const key in data) {
    stringData[key] = String(data[key]);
  }

  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: stringData,
    tokens: fcmTokens,
  };

  try {
    const response = await messaging.sendEachForMulticast(message);

    // Save notifications to database for all users
    if (userIds && userIds.length > 0) {
      try {
        const notifications = userIds.map((userId) => ({
          user_id: userId,
          title: notification.title,
          message: notification.body,
          type: data.type || null,
          data: stringData,
        }));
        await notificationModel.createMany(notifications);
      } catch (dbError) {}
    }

    return response;
  } catch (error) {
    return null;
  }
};

// Notification Templates
const notifications = {
  // Registration
  welcomeUser: (userName) => ({
    title: "Welcome to EZY Skills! 🎉",
    body: `Hi ${userName}! Start your learning journey with our amazing courses.`,
  }),

  welcomeTeacher: (teacherName) => ({
    title: "Welcome Teacher! 👨‍🏫",
    body: `Hi ${teacherName}! You can now create and manage your courses.`,
  }),

  welcomeAdmin: (adminName) => ({
    title: "Welcome Admin! 👑",
    body: `Hi ${adminName}! You have full access to manage the platform.`,
  }),

  newUserRegistered: (userName, role) => ({
    title: "New User Registration 👤",
    body: `${userName} just registered as a ${role}.`,
  }),

  // Courses
  courseCreated: (courseName) => ({
    title: "New Course Available! 📚",
    body: `${courseName} is now available. Enroll today and start learning!`,
  }),

  courseUpdated: (courseName) => ({
    title: "Course Updated 📝",
    body: `${courseName} has been updated with new content.`,
  }),

  coursePurchasedByUser: (courseName) => ({
    title: "Course Purchased Successfully! 🎓",
    body: `You have successfully enrolled in ${courseName}. Start learning now!`,
  }),

  coursePurchased: (courseName, studentName) => ({
    title: "Course Purchased! 🎓",
    body: `${studentName || "A student"} purchased your course: ${courseName}`,
  }),

  courseExpiring: (courseName, daysLeft) => ({
    title: "Course Access Expiring ⏰",
    body: `Your access to ${courseName} expires in ${daysLeft} days.`,
  }),

  courseExpired: (courseName) => ({
    title: "Course Access Expired 🔴",
    body: `Your access to ${courseName} has expired.`,
  }),

  // Plans
  planCreated: (planName) => ({
    title: "New Plan Available! 🎯",
    body: `${planName} is now available. Check it out and subscribe today!`,
  }),

  planCreatedAdmin: (planName) => ({
    title: "Plan Created Successfully ✅",
    body: `${planName} has been created and is now in the system.`,
  }),

  planUpdated: (planName) => ({
    title: "Plan Updated 📝",
    body: `${planName} has been updated.`,
  }),

  planDeleted: (planName) => ({
    title: "Plan Deleted 🗑️",
    body: `${planName} has been removed from the platform.`,
  }),

  planActivated: (planName) => ({
    title: "Plan Now Active! 🟢",
    body: `${planName} is now active and available for subscription.`,
  }),

  planDeactivated: (planName) => ({
    title: "Plan Deactivated 🔴",
    body: `${planName} has been deactivated and is no longer available.`,
  }),

  planStatusChanged: (planName, status) => ({
    title: `Plan ${status.charAt(0).toUpperCase() + status.slice(1)} 🔄`,
    body: `${planName} has been ${status}.`,
  }),

  planPurchasedByUser: (planName) => ({
    title: "Plan Purchased Successfully! 🎉",
    body: `You have successfully subscribed to ${planName}. Enjoy your benefits!`,
  }),

  planPurchased: (planName, customerName) => ({
    title: "New Plan Purchase! 💳",
    body: `${customerName || "A customer"} purchased the ${planName} plan.`,
  }),

  planExpiring: (planName, daysLeft) => ({
    title: "Plan Expiring Soon ⏰",
    body: `Your ${planName} plan expires in ${daysLeft} days. Renew now!`,
  }),

  planExpired: (planName) => ({
    title: "Plan Expired 🔴",
    body: `Your ${planName} plan has expired. Renew to continue access.`,
  }),

  // Admin
  teacherCreated: (teacherName, adminName) => ({
    title: "New Teacher Account Created 👨‍🏫",
    body: `${adminName} created an account for teacher: ${teacherName}`,
  }),

  // Purchase Approval Requests
  planPurchaseApprovalRequest: (planName, customerName) => ({
    title: "Plan Purchase Approval Needed 📋",
    body: `${customerName} wants to purchase ${planName}. Please review and approve.`,
  }),

  coursePurchaseApprovalRequest: (courseName, customerName) => ({
    title: "Course Enrollment Approval Needed 📋",
    body: `${customerName} wants to enroll in ${courseName}. Please review and approve.`,
  }),

  // Purchase Approval Responses
  planPurchaseApproved: (planName) => ({
    title: "Plan Purchase Approved! ✅",
    body: `Your purchase of ${planName} has been approved. You can now access all benefits!`,
  }),

  planPurchaseRejected: (planName) => ({
    title: "Plan Purchase Declined ❌",
    body: `Your purchase request for ${planName} was not approved. Contact support for details.`,
  }),

  coursePurchaseApproved: (courseName) => ({
    title: "Course Enrollment Approved! ✅",
    body: `You've been approved to enroll in ${courseName}. Start learning now!`,
  }),

  coursePurchaseRejected: (courseName) => ({
    title: "Course Enrollment Declined ❌",
    body: `Your enrollment request for ${courseName} was not approved. Contact the instructor for details.`,
  }),

  systemUpdate: (message) => ({
    title: "System Update 🔔",
    body: message,
  }),
};

module.exports = {
  sendNotification,
  sendMulticastNotification,
  notifications,
  messaging,
};
