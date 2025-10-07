// resetCoopUser.js
// Run with: node resetCoopUser.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const User = require("./models/User"); // adjust if path differs

async function upsertCoopUser() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not set in .env. Aborting.");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // CHANGE THESE to the email/password you want
    const newEmail = "satykush13579@gmail.com";     // <- replace with desired coop email
    const newPlainPassword = "satyam";  // <- replace with a strong password

    const hashed = await bcrypt.hash(newPlainPassword, 10);

    const update = {
      name: "Cooperative Admin",
      email: newEmail,
      password: hashed,
      role: "cooperative",
      isApproved: true,
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const user = await User.findOneAndUpdate(
      { email: newEmail }, // match by email
      { $set: update },
      options
    );

    console.log("✅ Cooperative user created/updated:");
    console.log("  email:", user.email);
    console.log("  plain password (copy this):", newPlainPassword);
    console.log("\n→ Now you can login with these credentials.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message || err);
    process.exit(1);
  }
}

upsertCoopUser();
