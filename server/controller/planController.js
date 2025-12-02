const planModel = require("../model/planModel");
const ora = require("ora");
const userModel = require("../model/userModel");
const {
  sendMulticastNotification,
  notifications,
} = require("../services/firebaseService");

const planController = {
  // Create a new plan (Admin only)
  createPlan: async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        price_note,
        gst_note,
        features,
        button_text,
        duration_days,
        is_highlighted,
        is_active,
      } = req.body;

      // Validate required fields
      if (
        !title ||
        price === undefined ||
        price === null ||
        isNaN(price) ||
        price < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Title and valid non-negative price are required",
        });
      }

      const plan = await planModel.create({
        title,
        description,
        price,
        price_note,
        gst_note,
        features: features || [],
        button_text,
        duration_days,
        is_highlighted,
        is_active,
        created_by: req.user.id,
      });

      try {
        // Notify customers about new plan
        const customerTokens = await userModel.getFcmTokensByRole("customer");
        const customerIds = await userModel.getUserIdsByRole("customer");
        if (customerTokens.length > 0) {
          await sendMulticastNotification(
            customerTokens,
            notifications.planCreated(title),
            {
              type: "plan_created",
              planId: plan.id.toString(),
            },
            customerIds
          );
        }

        // Notify admins about plan creation
        const adminTokens = await userModel.getFcmTokensByRole("admin");
        const adminIds = await userModel.getUserIdsByRole("admin");
        if (adminTokens.length > 0) {
          await sendMulticastNotification(
            adminTokens,
            notifications.planCreatedAdmin(title),
            {
              type: "plan_created",
              planId: plan.id.toString(),
            },
            adminIds
          );
        }
      } catch (notifyErr) {
        // Silent fail on notification error
      }

      res.status(201).json({
        success: true,
        message: "Plan created successfully",
        data: plan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create plan",
      });
    }
  },

  // Get all plans (Public)
  getAllPlans: async (req, res) => {
    try {
      const { is_active, search, limit, offset } = req.query;

      const filters = {};
      if (is_active !== undefined) {
        filters.is_active = is_active === "true";
      }
      if (search) filters.search = search;
      if (limit) filters.limit = parseInt(limit);
      if (offset) filters.offset = parseInt(offset);

      const { plans, total } = await planModel.findAll(filters);

      res.status(200).json({
        success: true,
        data: plans,
        total: total,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch plans",
      });
    }
  },

  // Get plan by ID (Public)
  getPlanById: async (req, res) => {
    try {
      const { id } = req.params;

      const plan = await planModel.findById(id);

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found",
        });
      }

      res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch plan",
      });
    }
  },

  // Update plan (Admin only)
  updatePlan: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        price,
        price_note,
        gst_note,
        features,
        button_text,
        duration_days,
        is_highlighted,
        is_active,
      } = req.body;

      // Validate price if provided
      if (price !== undefined && (price < 0 || isNaN(price))) {
        return res.status(400).json({
          success: false,
          message: "Price must be a non-negative number",
        });
      }

      const plan = await planModel.update(id, {
        title,
        description,
        price,
        price_note,
        gst_note,
        features,
        button_text,
        duration_days,
        is_highlighted,
        is_active,
      });

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found",
        });
      }

      try {
        // Notify admins about plan update
        const adminTokens = await userModel.getFcmTokensByRole("admin");
        const adminIds = await userModel.getUserIdsByRole("admin");
        if (adminTokens.length > 0) {
          await sendMulticastNotification(
            adminTokens,
            notifications.planUpdated(plan.title),
            {
              type: "plan_updated",
              planId: plan.id.toString(),
            },
            adminIds
          );
        }

        // If plan status changed to active/inactive, notify customers
        if (is_active !== undefined) {
          const customerTokens = await userModel.getFcmTokensByRole("customer");
          const customerIds = await userModel.getUserIdsByRole("customer");
          if (customerTokens.length > 0) {
            const statusNotification = is_active
              ? notifications.planActivated(plan.title)
              : notifications.planDeactivated(plan.title);
            await sendMulticastNotification(
              customerTokens,
              statusNotification,
              {
                type: is_active ? "plan_activated" : "plan_deactivated",
                planId: plan.id.toString(),
              },
              customerIds
            );
          }
        }
      } catch (notifyErr) {
        // Silent fail on notification error
      }

      res.status(200).json({
        success: true,
        message: "Plan updated successfully",
        data: plan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update plan",
      });
    }
  },

  // Toggle plan active/inactive status (Admin only)
  togglePlanStatus: async (req, res) => {
    try {
      const { id } = req.params;

      // Get current plan
      const currentPlan = await planModel.findById(id);

      if (!currentPlan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found",
        });
      }

      // Toggle the is_active status
      const newStatus = !currentPlan.is_active;

      const plan = await planModel.update(id, {
        is_active: newStatus,
      });

      try {
        // Notify admins about status change
        const adminTokens = await userModel.getFcmTokensByRole("admin");
        const adminIds = await userModel.getUserIdsByRole("admin");
        if (adminTokens.length > 0) {
          const statusText = newStatus ? "activated" : "deactivated";
          await sendMulticastNotification(
            adminTokens,
            notifications.planStatusChanged(plan.title, statusText),
            {
              type: "plan_status_changed",
              planId: plan.id.toString(),
              status: newStatus.toString(),
            },
            adminIds
          );
        }

        // Notify customers about status change
        const customerTokens = await userModel.getFcmTokensByRole("customer");
        const customerIds = await userModel.getUserIdsByRole("customer");
        if (customerTokens.length > 0) {
          const statusNotification = newStatus
            ? notifications.planActivated(plan.title)
            : notifications.planDeactivated(plan.title);
          await sendMulticastNotification(
            customerTokens,
            statusNotification,
            {
              type: newStatus ? "plan_activated" : "plan_deactivated",
              planId: plan.id.toString(),
            },
            customerIds
          );
        }
      } catch (notifyErr) {
        // Silent fail on notification error
      }

      res.status(200).json({
        success: true,
        message: `Plan ${newStatus ? "activated" : "deactivated"} successfully`,
        data: plan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to toggle plan status",
      });
    }
  },

  // Delete plan (Admin only)
  deletePlan: async (req, res) => {
    try {
      const { id } = req.params;

      const plan = await planModel.delete(id);

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Plan not found",
        });
      }

      try {
        const adminTokens = await userModel.getFcmTokensByRole("admin");
        const adminIds = await userModel.getUserIdsByRole("admin");
        if (adminTokens.length > 0) {
          await sendMulticastNotification(
            adminTokens,
            notifications.planDeleted(plan.title),
            {
              type: "plan_deleted",
              planId: plan.id.toString(),
            },
            adminIds
          );
        }
      } catch (notifyErr) {
        // Silent fail on notification error
      }

      res.status(200).json({
        success: true,
        message: "Plan deleted successfully",
        data: plan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete plan",
      });
    }
  },

  // Get plan statistics (Admin only)
  getPlanStats: async (req, res) => {
    const spinner = ora("Fetching plan statistics...").start();
    try {
      const stats = await planModel.getStats();

      spinner.succeed("Plan statistics retrieved ✨");
      await new Promise((resolve) => setTimeout(resolve, 500));

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      spinner.fail("Failed to fetch plan statistics ❌");
      await new Promise((resolve) => setTimeout(resolve, 500));

      res.status(500).json({
        success: false,
        message: "Failed to fetch plan statistics",
      });
    }
  },

  // Get most popular plans (Public)
  getMostPopular: async (req, res) => {
    try {
      const { limit = 5 } = req.query;

      const plans = await planModel.getMostPopular(parseInt(limit));

      res.status(200).json({
        success: true,
        data: plans,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch popular plans",
      });
    }
  },
};

module.exports = planController;
