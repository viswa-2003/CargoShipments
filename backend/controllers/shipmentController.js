const Shipment = require('../models/shipmentModel');
const path = require('path');
const fs = require('fs');

// ============================
// Create new shipment
// ============================
exports.createShipment = async (req, res) => {
  try {
    // Handle file validation errors
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    let route = req.body.route;
    if (typeof route === 'string') {
      route = route.split(',').map(item => item.trim()).filter(item => item);
    }

    if (!Array.isArray(route) || route.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Route must be an array with at least 2 ports'
      });
    }

    const shipmentData = {
      ...req.body,
      route: route,
      currentLocation: req.body.currentLocation || route[0],
      status: req.body.status || 'Pending'
    };

    if (req.file) {
      shipmentData.image = req.file.filename;
    }

    const shipment = new Shipment(shipmentData);
    await shipment.save();

    const shipmentObj = shipment.toObject();
    if (shipmentObj.image) {
      shipmentObj.image = `${req.protocol}://${req.get('host')}/uploads/${shipmentObj.image}`;
    }

    res.status(201).json({
      success: true,
      data: shipmentObj
    });
  } catch (error) {
    console.error('Error creating shipment:', error);

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large (max 10MB)'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Shipment ID or Container ID already exists'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ============================
// Get all shipments
// ============================
exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });

    const shipmentsWithImageUrls = shipments.map(shipment => {
      const shipmentObj = shipment.toObject();
      if (shipmentObj.image) {
        shipmentObj.image = `${req.protocol}://${req.get('host')}/uploads/${shipmentObj.image}`;
      }
      return shipmentObj;
    });

    res.status(200).json({
      success: true,
      count: shipmentsWithImageUrls.length,
      data: shipmentsWithImageUrls
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shipments',
      error: error.message
    });
  }
};

// ============================
// Get shipment by ID
// ============================
exports.getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    const shipmentObj = shipment.toObject();
    if (shipmentObj.image) {
      shipmentObj.image = `${req.protocol}://${req.get('host')}/uploads/${shipmentObj.image}`;
    }

    res.status(200).json({
      success: true,
      data: shipmentObj
    });
  } catch (error) {
    console.error('Error fetching shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shipment',
      error: error.message
    });
  }
};

// ============================
// Update current location
// ============================
exports.updateLocation = async (req, res) => {
  try {
    const { currentLocation } = req.body;
    if (!currentLocation) {
      return res.status(400).json({
        success: false,
        message: 'Current location is required'
      });
    }

    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      { currentLocation },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: shipment
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating location',
      error: error.message
    });
  }
};

// ============================
// Get ETA
// ============================
exports.getETA = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        currentETA: shipment.currentETA,
        estimatedDeliveryTime: shipment.estimatedDeliveryTime
      }
    });
  } catch (error) {
    console.error('Error fetching ETA:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ETA',
      error: error.message
    });
  }
};

// ============================
// Delete shipment with image cleanup
// ============================
exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // Delete associated image file if exists
    if (shipment.image) {
      const imagePath = path.join(__dirname, '../uploads', shipment.image);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image file:', err);
          } else {
            console.log('Deleted image file:', shipment.image);
          }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Shipment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shipment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting shipment',
      error: error.message
    });
  }
};
