const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/quotes", require("./routes/quoteRoutes"));
app.use("/api/approvals", require("./routes/approvalRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));

app.get("/", (req, res) => res.send("Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
