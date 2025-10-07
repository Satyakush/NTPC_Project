// createCoopUser.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const User = require("./models/User"); // adjust path if needed

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Set your new credentials here
    const email = "coop.admin@example.com";       // <-- your new coop email
    const passwordPlain = "StrongP@ssw0rd123";    // <-- your new password

    const hashedPassword = await bcrypt.hash(passwordPlain, 10);

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name: "Cooperative Admin",
          email,
          password: hashedPassword,
          role: "cooperative",
          isApproved: true,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("✅ Cooperative admin created/updated:");
    console.log("Email:", email);
    console.log("Password:", passwordPlain);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating cooperative admin:", err.message);
    process.exit(1);
  }
})();
