const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  shipmentId: String,
  containerId: String,
  route: [String],
  currentLocation: String,
  currentETA: String,
  status: String,
  image: String
});

module.exports = mongoose.model('Shipment', shipmentSchema);
