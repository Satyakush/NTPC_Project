const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/quotes", require("./routes/quoteRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => res.send("✅ Backend is running"));

async function seedCoopUser() {
  try {
    if (!process.env.COOP_EMAIL || !process.env.COOP_PASSWORD) {
      console.warn("⚠️ Cooperative admin credentials are not configured");
      return;
    }

    const existing = await User.findOne({ email: process.env.COOP_EMAIL });

    if (!existing) {
      const hashedPassword = await bcrypt.hash(process.env.COOP_PASSWORD, 10);
      await User.create({
        name: "Cooperative Admin",
        email: process.env.COOP_EMAIL,
        password: hashedPassword,
        role: "cooperative",
        isApproved: true,
      });
      console.log("🌱 Cooperative admin user seeded");
    } else {
      console.log("🌱 Cooperative admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding cooperative user:", error.message);
  }
}

connectDB().then(() => {
  seedCoopUser();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
