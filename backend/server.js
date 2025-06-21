const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User"); // Import the User model
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/quotes", require("./routes/quoteRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/approvals", require("./routes/approvalRoutes"));

app.get("/", (req, res) => res.send("Backend is running"));

// Function to seed the cooperative user
async function seedCooperativeUser() {
  try {
    const email = process.env.COOP_EMAIL;
    const password = process.env.COOP_PASSWORD || "admin123"; // Default password

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("✅ Cooperative user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const coop = new User({
      name: "Cooperative Admin",
      email,
      password: hashedPassword,
      isVendor: false,
      isApproved: true,
      role: "cooperative",
    });

    await coop.save();
    console.log("🌱 Cooperative user created:", email);
  } catch (error) {
    console.error("❌ Error seeding cooperative user:", error.message);
  }
}

// Start server only after DB connects
connectDB().then(async () => {
  await seedCooperativeUser(); // Ensure the cooperative user is created
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
