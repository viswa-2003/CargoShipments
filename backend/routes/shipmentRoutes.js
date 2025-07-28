const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const upload = require('../middlewares/upload');

// Create new shipment with file upload
router.post('/', upload.single('image'), shipmentController.createShipment);

// Get all shipments
router.get('/', shipmentController.getAllShipments);

// Get single shipment
router.get('/:id', shipmentController.getShipmentById);

// Update location
router.put('/:id/update-location', shipmentController.updateLocation);

// Get ETA
router.get('/:id/eta', shipmentController.getETA);

// Delete shipment
router.delete('/:id', shipmentController.deleteShipment);

module.exports = router;