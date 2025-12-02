const trainerModel = require("../model/trainerModel");

const trainerController = {
  // Get all trainers (Public)
  getAllTrainers: async (req, res) => {
    try {
      const { is_active } = req.query;

      const filters = {};
      if (is_active !== undefined) {
        filters.is_active = is_active === "true";
      }

      const trainers = await trainerModel.findAll(filters);

      res.status(200).json({
        success: true,
        data: trainers,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch trainers",
      });
    }
  },

  // Get trainer by ID (Public)
  getTrainerById: async (req, res) => {
    try {
      const { id } = req.params;

      const trainer = await trainerModel.findById(id);

      if (!trainer) {
        return res.status(404).json({
          success: false,
          message: "Trainer not found",
        });
      }

      res.status(200).json({
        success: true,
        data: trainer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch trainer",
      });
    }
  },

  // Create a new trainer (Admin only)
  createTrainer: async (req, res) => {
    try {
      const {
        user_id,
        name,
        title,
        description,
        rating,
        reviews,
        modules,
        students,
        profile_image,
        is_active,
        display_order,
      } = req.body;

      if (!name || !title) {
        return res.status(400).json({
          success: false,
          message: "Name and title are required",
        });
      }

      const trainer = await trainerModel.create({
        user_id,
        name,
        title,
        description,
        rating,
        reviews,
        modules,
        students,
        profile_image,
        is_active,
        display_order,
      });

      res.status(201).json({
        success: true,
        message: "Trainer created successfully",
        data: trainer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create trainer",
      });
    }
  },

  // Update a trainer (Admin only)
  updateTrainer: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        user_id,
        name,
        title,
        description,
        rating,
        reviews,
        modules,
        students,
        profile_image,
        is_active,
        display_order,
      } = req.body;

      const trainer = await trainerModel.update(id, {
        user_id,
        name,
        title,
        description,
        rating,
        reviews,
        modules,
        students,
        profile_image,
        is_active,
        display_order,
      });

      if (!trainer) {
        return res.status(404).json({
          success: false,
          message: "Trainer not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Trainer updated successfully",
        data: trainer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update trainer",
      });
    }
  },

  // Delete a trainer (Admin only)
  deleteTrainer: async (req, res) => {
    try {
      const { id } = req.params;

      const trainer = await trainerModel.delete(id);

      if (!trainer) {
        return res.status(404).json({
          success: false,
          message: "Trainer not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Trainer deleted successfully",
        data: trainer,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete trainer",
      });
    }
  },
};

module.exports = trainerController;
