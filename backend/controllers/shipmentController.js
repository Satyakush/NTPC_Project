const Shipment = require("../models/Shipment");

exports.markShipped = async (req, res) => {
  const { request_id, tracking_number } = req.body;

  const shipment = await Shipment.findOneAndUpdate(
    { request_id, vendor_id: req.user.id },
    { shipped: true, shipped_at: new Date(), tracking_number },
    { upsert: true, new: true }
  );

  res.json(shipment);
};

exports.getVendorShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ vendor_id: req.user.id });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shipments" });
  }
};

exports.getShipmentByRequestId = async (req, res) => {
  try {
    const { request_id } = req.params;
    const shipment = await Shipment.findOne({ request_id });

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving shipment" });
  }
};
