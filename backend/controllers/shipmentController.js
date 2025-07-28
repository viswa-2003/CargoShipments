const Shipment = require('../models/shipmentModel');

// Get all shipments
exports.getAllShipments = async (req, res) => {
  const shipments = await Shipment.find();
  res.json(shipments);
};

// Get shipment by ID
exports.getShipmentById = async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  res.json(shipment);
};

// Create new shipment
exports.createShipment = async (req, res) => {
  const shipment = new Shipment(req.body);
  await shipment.save();
  res.json(shipment);
};

// Update location
exports.updateLocation = async (req, res) => {
  const { currentLocation } = req.body;
  const shipment = await Shipment.findByIdAndUpdate(
    req.params.id,
    { currentLocation },
    { new: true }
  );
  res.json(shipment);
};

// Get ETA (mock logic)
exports.getETA = async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  shipment.currentETA = '2025-07-25T12:00:00Z'; // Placeholder
  res.json({ eta: shipment.currentETA });
};
