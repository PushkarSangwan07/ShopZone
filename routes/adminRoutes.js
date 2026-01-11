const express = require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { getAllUsers, deleteUser, promoteUser, demoteUser } = require("../controller/adminController");

const router = express.Router();

// Get all users (for admin panel)
router.get("/users", authMiddleware, isAdmin, getAllUsers);

// Delete a user
router.delete("/users/:id", authMiddleware, isAdmin, deleteUser);

// Promote a user to admin
router.put("/users/:id/promote", authMiddleware, isAdmin, promoteUser);

router.put("/users/:id/demote", authMiddleware, isAdmin, demoteUser);


module.exports = router;
