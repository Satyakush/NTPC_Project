const express = require("express");
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getVendorItems,
  getAllRequests,
  getPublishedRequests,
  publishRequest,
  getRequestById,
} = require("../controllers/requestController");

const { protect } = require("../middleware/authMiddleware");

// Order matters: put specific routes before generic ones
router.post("/", protect, createRequest);
router.get("/mine", protect, getMyRequests);
router.get("/vendor-items", protect, getVendorItems);
router.get("/all", protect, getAllRequests);
router.get("/published", protect, getPublishedRequests);
router.put("/publish/:id", protect, publishRequest);
router.get("/:id", protect, getRequestById); // <-- this MUST be last

module.exports = router;
