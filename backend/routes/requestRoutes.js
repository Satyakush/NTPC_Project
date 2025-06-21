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

router.post("/", auth, role("customer"), createRequest);
router.post("/publish", auth, role("cooperative"), publishRequest);
router.get("/mine", auth, role("customer"), getMyRequests);
router.get("/", auth, role("cooperative"), getAllRequests);

module.exports = router;
