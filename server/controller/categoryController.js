const categoryModel = require("../model/categoryModel");

const categoryController = {
  // Get all categories (Public)
  getAllCategories: async (req, res) => {
    try {
      const { is_active } = req.query;

      const filters = {};
      if (is_active !== undefined) {
        filters.is_active = is_active === "true";
      }

      const categories = await categoryModel.findAll(filters);

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

  // Get category by ID (Public)
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await categoryModel.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch category",
      });
    }
  },

  // Create a new category (Admin only)
  createCategory: async (req, res) => {
    try {
      const { name, color, is_active } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const category = await categoryModel.create({
        name,
        color,
        is_active,
      });

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create category",
      });
    }
  },

  // Update a category (Admin only)
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, color, is_active } = req.body;

      const category = await categoryModel.update(id, {
        name,
        color,
        is_active,
      });

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update category",
      });
    }
  },

  // Delete a category (Admin only)
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await categoryModel.delete(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete category",
      });
    }
  },
};

module.exports = categoryController;
