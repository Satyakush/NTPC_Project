const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipmentController");
const authMiddleware = require("../middleware/authMiddleware");

// Mark as shipped
router.post("/", authMiddleware, shipmentController.markShipped);

// Get all shipments for vendor
router.get("/", authMiddleware, shipmentController.getVendorShipments);

// Get shipment by request ID
router.get(
  "/:request_id",
  authMiddleware,
  shipmentController.getShipmentByRequestId
);

module.exports = router;
