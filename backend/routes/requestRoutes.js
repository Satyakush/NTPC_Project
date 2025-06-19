const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a request
router.post("/", authMiddleware, requestController.createRequest);

// Requests by customer
router.get(
  "/customer",
  authMiddleware,
  requestController.getRequestsByCustomer
);

// All requests (cooperative/admin)
router.get("/", authMiddleware, requestController.getAllRequests);

module.exports = router;
