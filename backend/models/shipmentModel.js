const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  shipmentId: { type: String, required: true, unique: true },
  containerId: { type: String, required: true, unique: true },
  route: { type: [String], required: true },
  currentLocation: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'In Transit', 'Delayed', 'Delivered', 'Received'], // Updated to match "In Transit"
    default: 'Pending'
  },
  image: { type: String },
  departureTime: { type: Date, default: Date.now },
  estimatedDeliveryTime: { type: Date },
  currentETA: { type: Date },
  cargoType: { type: String, required: true },
  cargoWeight: { type: Number, required: true },
  cargoDescription: { type: String },
  shipperName: { type: String, required: true },
  shipperContact: { type: String, required: true },
  consigneeName: { type: String, required: true },
  consigneeContact: { type: String, required: true },
  vesselName: { type: String },
  voyageNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Calculate ETA before saving
shipmentSchema.pre('save', function(next) {
  if (this.isModified('route') || this.isModified('currentLocation')) {
    this.estimatedDeliveryTime = calculateETA(this.route, this.departureTime);
    this.currentETA = calculateCurrentETA(this.route, this.currentLocation);
  }
  next();
});

// Helper functions
function calculateETA(route, departureTime) {
  const portDistances = {
    'Mumbai-Singapore': 1800,
    'Singapore-Colombo': 1200,
    'Colombo-Dubai': 1600,
    'Dubai-Rotterdam': 4200,
    '_default': 1000
  };
  
  const averageSpeed = 18; // knots
  let totalDistance = 0;
  
  for (let i = 0; i < route.length - 1; i++) {
    const key = `${route[i]}-${route[i+1]}`;
    totalDistance += portDistances[key] || portDistances['_default'];
  }
  
  const hours = totalDistance / averageSpeed;
  const eta = new Date(departureTime);
  eta.setHours(eta.getHours() + hours);
  
  return eta;
}

function calculateCurrentETA(route, currentLocation) {
  const currentIndex = route.indexOf(currentLocation);
  if (currentIndex === -1 || currentIndex >= route.length - 1) return null;
  
  const remainingRoute = route.slice(currentIndex);
  return calculateETA(remainingRoute, new Date());
}

module.exports = mongoose.model('Shipment', shipmentSchema);