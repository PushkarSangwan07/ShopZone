const express = require("express");
const User = require("../model/user");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

const userRouter = express.Router();

//  Admin  see all users
userRouter.get("/", authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
});

// Demote admin to regular user
userRouter.patch("/:id/demote", authMiddleware, isAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: "user" },
      { new: true }
    );
    res.json({ success: true, user: updatedUser, message: `${updatedUser.email} is now a regular user` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



module.exports = userRouter;
