const achievementModel = require("../model/achievementModel");

const achievementController = {
  // Get all achievements (Public)
  getAllAchievements: async (req, res) => {
    try {
      const { is_active } = req.query;

      const filters = {};
      if (is_active !== undefined) {
        filters.is_active = is_active === "true";
      }

      const achievements = await achievementModel.findAll(filters);

      res.status(200).json({
        success: true,
        data: achievements,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch achievements",
      });
    }
  },

  // Get achievement by ID (Public)
  getAchievementById: async (req, res) => {
    try {
      const { id } = req.params;

      const achievement = await achievementModel.findById(id);

      if (!achievement) {
        return res.status(404).json({
          success: false,
          message: "Achievement not found",
        });
      }

      res.status(200).json({
        success: true,
        data: achievement,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch achievement",
      });
    }
  },

  // Create a new achievement (Admin only)
  createAchievement: async (req, res) => {
    try {
      const { number, label, icon, display_order, is_active } = req.body;

      if (!number || !label) {
        return res.status(400).json({
          success: false,
          message: "Number and label are required",
        });
      }

      const achievement = await achievementModel.create({
        number,
        label,
        icon,
        display_order,
        is_active,
      });

      res.status(201).json({
        success: true,
        message: "Achievement created successfully",
        data: achievement,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create achievement",
      });
    }
  },

  // Update an achievement (Admin only)
  updateAchievement: async (req, res) => {
    try {
      const { id } = req.params;
      const { number, label, icon, display_order, is_active } = req.body;

      const achievement = await achievementModel.update(id, {
        number,
        label,
        icon,
        display_order,
        is_active,
      });

      if (!achievement) {
        return res.status(404).json({
          success: false,
          message: "Achievement not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Achievement updated successfully",
        data: achievement,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update achievement",
      });
    }
  },

  // Delete an achievement (Admin only)
  deleteAchievement: async (req, res) => {
    try {
      const { id } = req.params;

      const achievement = await achievementModel.delete(id);

      if (!achievement) {
        return res.status(404).json({
          success: false,
          message: "Achievement not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Achievement deleted successfully",
        data: achievement,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete achievement",
      });
    }
  },
};

module.exports = achievementController;
