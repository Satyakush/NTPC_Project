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
  finalizeRequest,
} = require("../controllers/requestController");

const { protect } = require("../middleware/authMiddleware");
const { isCooperative } = require("../middleware/roleMiddleware");
const { canAccessRequest } = require("../middleware/requestAccessMiddleware");

router.post("/", protect, createRequest);
router.get("/mine", protect, getMyRequests);
router.get("/vendor-items", protect, getVendorItems);
router.get("/all", protect, isCooperative, getAllRequests);
router.get("/published", protect, getPublishedRequests);
router.put("/publish/:id", protect, isCooperative, publishRequest);
router.put("/finalize/:id", protect, isCooperative, finalizeRequest);
router.get("/:id", protect, canAccessRequest, getRequestById);

module.exports = router;
