const Shipment = require('../models/shipmentModel');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// ============================
// ============================
// Create new shipment
// ============================
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

    // With multer-storage-cloudinary, req.file.path is the Cloudinary URL
    if (req.file) {
      shipmentData.image = req.file.path; // This is the Cloudinary URL
    }

    const shipment = new Shipment(shipmentData);
    await shipment.save();

    res.status(201).json({
      success: true,
      data: shipment
    });
  } catch (error) {
    console.error('Error creating shipment:', error);

    // If there was an error and a file was uploaded to Cloudinary, delete it
    if (req.file && req.file.filename) {
      try {
        // Extract public_id from the Cloudinary file info
        const publicId = req.file.filename; // multer-storage-cloudinary stores public_id in filename
        await cloudinary.uploader.destroy(publicId);
        console.log('Cleaned up Cloudinary image:', publicId);
      } catch (err) {
        console.error('Error cleaning up uploaded image:', err);
      }
    }

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

    // No need to transform image URLs since we're storing full Cloudinary URLs
    const shipmentsWithImageUrls = shipments.map(shipment => {
      const shipmentObj = shipment.toObject();
      // Image is already full Cloudinary URL, so no transformation needed
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
    // Image is already full Cloudinary URL, so no transformation needed

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

    // Delete associated image from Cloudinary if exists
    if (shipment.image) {
      try {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/dunselky1/image/upload/v1763733304/shipment-images/ron5sa8bikwjic2fjo74.png
        const urlParts = shipment.image.split('/');
        
        // Find the index of 'upload' to get the parts after it
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex !== -1) {
          // The public_id is everything after 'upload' but we need to remove the version part
          const pathAfterUpload = urlParts.slice(uploadIndex + 1).join('/');
          
          // Remove the file extension to get the public_id
          const publicId = pathAfterUpload.replace(/\.[^/.]+$/, ""); // Remove file extension
          
          await cloudinary.uploader.destroy(publicId);
          console.log('Deleted image from Cloudinary:', publicId);
        } else {
          console.log('Could not extract public_id from URL:', shipment.image);
        }
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
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
// ============================
// Update shipment (if you have this method)
// ============================
exports.updateShipment = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Handle route transformation if provided
    if (req.body.route) {
      let route = req.body.route;
      if (typeof route === 'string') {
        route = route.split(',').map(item => item.trim()).filter(item => item);
      }
      updateData.route = route;
    }

    // Handle file upload if new image provided
    if (req.file) {
      // Delete old image from Cloudinary
      const oldShipment = await Shipment.findById(req.params.id);
      if (oldShipment && oldShipment.image) {
        try {
          const urlParts = oldShipment.image.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0];
          const fullPublicId = `shipment-images/${publicId}`;
          
          await cloudinary.uploader.destroy(fullPublicId);
        } catch (err) {
          console.error('Error deleting old image from Cloudinary:', err);
        }
      }

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'shipment-images'
      });
      
      updateData.image = result.secure_url;
      
      // Delete local file
      fs.unlinkSync(req.file.path);
    }

    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
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
    console.error('Error updating shipment:', error);
    
    // Clean up local file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
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
      message: 'Error updating shipment',
      error: error.message
    });
  }
};