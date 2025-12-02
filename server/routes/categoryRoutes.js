const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
const authenticateToken = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleMiddleware");

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Admin routes
router.post("/", authenticateToken, isAdmin, categoryController.createCategory);
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  categoryController.updateCategory
);
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  categoryController.deleteCategory
);

module.exports = router;
