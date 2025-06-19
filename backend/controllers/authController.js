const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");
const Vendor = require("../models/Vendor");
const Cooperative = require("../models/Cooperative");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let userModel;
    if (role === "customer") userModel = Customer;
    else if (role === "vendor") userModel = Vendor;
    else if (role === "cooperative") userModel = Cooperative;
    else return res.status(400).json({ error: "Invalid role" });

    const existing = await userModel.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already exists" });

    const user = await userModel.create({
      name,
      email,
      password_hash: hashedPassword,
      email_verified: true, // can set to false if you implement email verification
    });

    const token = generateToken(user._id, role);
    res.status(201).json({
      token,
      user: { name: user.name, email: user.email, role },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let userModel;
    if (role === "customer") userModel = Customer;
    else if (role === "vendor") userModel = Vendor;
    else if (role === "cooperative") userModel = Cooperative;
    else return res.status(400).json({ error: "Invalid role" });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user._id, role);
    res.status(200).json({
      token,
      user: { name: user.name, email: user.email, role },
    });
  } catch (err) {
    console.error("Register Error:", err); // ✅ log the real issue
    res.status(500).json({ error: "Server error" });
  }
};
