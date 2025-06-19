const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const cors = require("cors");
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173/", // React app origin
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/quotes", require("./routes/quoteRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/approvals", require("./routes/approvalRoutes"));
app.use("/api/shipments", require("./routes/shipmentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
