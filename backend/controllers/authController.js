// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

// REGISTER NEW USER
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      organization,
      address,
      gstNumber,
      password,
      isVendor,
      role,
    } = req.body;

    // Optional: Validate role
    if (!["customer", "vendor", "cooperative"].includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      organization,
      address,
      gstNumber,
      password: hashedPassword,
      isVendor,
      isApproved: false, // wait for approval
      role,
    });

    await newUser.save();

    await transporter.sendMail({
      from: process.env.COOP_EMAIL,
      to: email,
      subject: "Registration Submitted",
      text: "Your account is pending approval by the cooperative.",
    });

    res
      .status(201)
      .json({ message: "User  registered successfully. Pending approval." });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// LOGIN EXISTING USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User  not found with that email" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// APPROVE USER BY COOPERATIVE
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found for approval" });
    }

    user.isApproved = true;
    await user.save();

    await transporter.sendMail({
      from: process.env.COOP_EMAIL,
      to: user.email,
      subject: "Account Approved",
      text: "Your registration has been approved. You can now log in.",
    });

    res.json({ message: "User  approved successfully" });
  } catch (error) {
    console.error("Approval error:", error.message);
    res.status(500).json({ message: "Server error during user approval" });
  }
};

// GET PENDING USERS
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false });
    res.json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
