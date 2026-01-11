const jwt = require("jsonwebtoken");
const UserModel = require('../model/user');


const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.Jwt_SECRET); 
    // console.log(" Decoded token:", decoded);

    const user = await UserModel.findById(decoded.id);
    // console.log(" Fetched User from DB:", user);


    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; 
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized", error: err.message });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") { 
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { authMiddleware, isAdmin };

