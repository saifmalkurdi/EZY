const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const userModel = require("../model/userModel");
const { generateToken, formatUserResponse } = require("../utils/helper");
const {
  sendNotification,
  sendMulticastNotification,
  notifications,
} = require("../services/firebaseService");

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { full_name, email, password, phone, role } = req.body;

      // Validate required fields
      if (!full_name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Full name, email, and password are required",
        });
      }

      // Validate role if provided
      const validRoles = ["customer", "teacher", "admin"];
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Must be customer, teacher, or admin",
        });
      }

      // Check if user exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await userModel.create({
        full_name,
        email,
        password: hashedPassword,
        phone,
        role: role || "customer",
      });

      const token = generateToken(newUser);

      try {
        const adminTokens = await userModel.getFcmTokensByRole("admin");
        const adminIds = await userModel.getUserIdsByRole("admin");
        if (adminTokens.length > 0) {
          await sendMulticastNotification(
            adminTokens,
            notifications.newUserRegistered(full_name, newUser.role),
            {
              type: "new_user",
              userId: newUser.id.toString(),
              userRole: newUser.role,
            },
            adminIds
          );
        }
      } catch (notifyErr) {}

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: formatUserResponse(newUser),
          token,
        },
      });
    } catch (error) {
      if (error.code === "23505") {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Check if user exists
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check if user account is active
      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: "Your account has been deactivated. Please contact support.",
        });
      }

      // check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate Token
      const token = generateToken(user);

      // send Response
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: formatUserResponse(user),
          token,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      // Find user by ID
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Send response
      res.status(200).json({
        success: true,
        data: formatUserResponse(user),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Logout user
  logout: async (req, res) => {
    try {
      // In a stateless JWT system, logout is handled client-side by removing the token
      // This endpoint can be used for logging purposes or future token blacklisting

      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // delete user account
  deleteAccount: async (req, res) => {
    try {
      // delete user by ID
      await userModel.deleteUser(req.user.id);

      // send response
      res.status(200).json({
        success: true,
        message: "User account deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // Create a new teacher (Admin only)
  createTeacher: async (req, res) => {
    try {
      const { full_name, email, password } = req.body;

      // Validate required fields
      if (!full_name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Full name, email, and password are required",
        });
      }

      // Check if user exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new teacher
      const newTeacher = await userModel.create({
        full_name,
        email,
        password: hashedPassword,
        role: "teacher",
      });

      // Notify all admins about new teacher account
      try {
        const adminTokens = await userModel.getFcmTokensByRole("admin");
        const adminIds = await userModel.getUserIdsByRole("admin");
        if (adminTokens.length > 0) {
          await sendMulticastNotification(
            adminTokens,
            notifications.teacherCreated(full_name, req.user.full_name),
            {
              type: "teacher_created",
              teacherId: newTeacher.id.toString(),
              createdBy: req.user.id.toString(),
            },
            adminIds
          );
        }
      } catch (notifyErr) {}

      res.status(201).json({
        success: true,
        message: "Teacher created successfully",
        data: formatUserResponse(newTeacher),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create teacher",
      });
    }
  },

  updateFcmToken: async (req, res) => {
    try {
      const { fcmToken } = req.body;
      const userId = req.user.id;

      if (!fcmToken) {
        return res.status(400).json({
          success: false,
          message: "FCM token is required",
        });
      }

      await userModel.updateFcmToken(userId, fcmToken);

      try {
        const user = await userModel.findById(userId);
        let welcomeNotification;

        if (user.role === "teacher") {
          welcomeNotification = notifications.welcomeTeacher(user.full_name);
        } else if (user.role === "customer") {
          welcomeNotification = notifications.welcomeUser(user.full_name);
        } else if (user.role === "admin") {
          welcomeNotification = notifications.welcomeAdmin(user.full_name);
        }

        if (welcomeNotification) {
          // Send transient welcome notification (not stored in database)
          const dataToSend = {
            type: "welcome",
            role: user.role,
          };

          // Send notification without userId to prevent database storage
          await sendNotification(fcmToken, welcomeNotification, dataToSend, {
            transient: true,
          });
        }
      } catch (notifyErr) {}

      res.status(200).json({
        success: true,
        message: "FCM token updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating FCM token",
        error: error.message,
      });
    }
  },
};

module.exports = authController;
