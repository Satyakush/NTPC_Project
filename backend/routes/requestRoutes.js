const express = require("express");
const router = express.Router();
const {
  createRequest,
  publishRequest,
  getMyRequests,
  getAllRequests,
} = require("../controllers/requestController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Create a new request (accessible by customer role)
router.post("/", auth, role("customer"), createRequest);

// Publish a request (accessible by cooperative role)
router.post("/publish", auth, role("cooperative"), publishRequest);

// Get requests made by the authenticated customer
router.get("/mine", auth, role("customer"), getMyRequests);

// Get all requests (accessible by cooperative role)
router.get("/", auth, role("cooperative"), getAllRequests);

module.exports = router;
