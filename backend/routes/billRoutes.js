const router = require("express").Router();

const {
  getCustomerBills,
  getVendorBills,
  getAllBills,
} = require("../controllers/billController");

const { protect } = require("../middleware/authMiddleware");
const { isCooperative } = require("../middleware/roleMiddleware");

// Customer: see only their bills
router.get("/customer", protect, getCustomerBills);

// Vendor: see only their bills
router.get("/vendor", protect, getVendorBills);

// Cooperative: see all bills including commission
router.get("/all", protect, isCooperative, getAllBills);

module.exports = router;