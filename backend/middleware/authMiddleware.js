const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).send("Access denied.");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id);
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};

module.exports = authMiddleware;
