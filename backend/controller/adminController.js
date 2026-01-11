const User = require("../model/user");

// Get all users (admin panel)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: err.message });
  }
};

// Promote a user to admin
const promoteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent promoting yourself
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You are already an admin" });
    }

    const userToPromote = await User.findById(id);
    if (!userToPromote) return res.status(404).json({ success: false, message: "User not found" });

    if (userToPromote.role === "admin") {
      return res.status(400).json({ success: false, message: "User is already an admin" });
    }

    userToPromote.role = "admin";
    await userToPromote.save();

    res.json({ success: true, user: userToPromote, message: `${userToPromote.email} is now an admin` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Demote admin to regular user
const demoteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from demoting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot demote yourself" });
    }

    const userToDemote = await User.findById(id);
    if (!userToDemote) return res.status(404).json({ success: false, message: "User not found" });

    if (userToDemote.role !== "admin") {
      return res.status(400).json({ success: false, message: "User is not an admin" });
    }

    userToDemote.role = "user";
    await userToDemote.save();

    res.json({ success: true, user: userToDemote, message: `${userToDemote.email} is now a regular user` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot delete yourself" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: `${deletedUser.email} has been deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllUsers, promoteUser, demoteUser, deleteUser };
