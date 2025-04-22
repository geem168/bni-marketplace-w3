const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function authentication(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Format: Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id); // Mencari user berdasarkan ID yang ada dalam token

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Menyimpan user ke req.user untuk dipakai di controller
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authentication;
