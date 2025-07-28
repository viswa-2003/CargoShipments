const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const Shipment = require('../models/shipmentModel');
const upload = require('../middlewares/upload'); // ✅ from your middleware folder

// ✅ DELETE shipment
router.delete('/shipment/:id', async (req, res) => {
  try {
    const deleted = await Shipment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.status(200).json({ message: "Shipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting shipment:", error);
    res.status(500).json({ message: "Error deleting shipment", error: error.message });
  }
});

// ✅ POST shipment with image upload
router.post('/shipment', upload.single('image'), async (req, res) => {
  try {
    const { shipmentId, containerId, currentLocation, route, status } = req.body;

    const newShipment = new Shipment({
      shipmentId,
      containerId,
      currentLocation,
      route: route.split(',').map(r => r.trim()),
      status,
      image: req.file?.filename || null,
    });

    await newShipment.save();
    res.status(201).json(newShipment);
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ message: "Error creating shipment", error: error.message });
  }
});

// ✅ Other routes using controller
router.get('/shipments', shipmentController.getAllShipments);
router.get('/shipment/:id', shipmentController.getShipmentById);
router.post('/shipment/:id/update-location', shipmentController.updateLocation);
router.get('/shipment/:id/eta', shipmentController.getETA);

module.exports = router;
