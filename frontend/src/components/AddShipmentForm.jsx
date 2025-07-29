import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config';;
const AddShipmentForm = () => {
  const [formData, setFormData] = useState({
    shipmentId: '',
    containerId: '',
    currentLocation: '',
    status: 'Pending',
    route: '',
    departureTime: new Date().toISOString().slice(0, 16),
    estimatedDeliveryTime: '',
    cargoType: '',
    cargoWeight: '',
    cargoDescription: '',
    shipperName: '',
    shipperContact: '',
    consigneeName: '',
    consigneeContact: '',
    vesselName: '',
    voyageNumber: ''
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();

    // Copy formData and parse route into an array
    const parsedData = {
      ...formData,
      route: formData.route.split(',').map((r) => r.trim())
    };

    Object.keys(parsedData).forEach((key) => {
      if (Array.isArray(parsedData[key])) {
        // Append arrays properly
        parsedData[key].forEach((val) => {
          data.append(`${key}[]`, val);
        });
      } else {
        data.append(key, parsedData[key]);
      }
    });

    if (image) {
      data.append('image', image);
    }

    try {
      await axios.post(getApiUrl('/shipments'), data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/shipments');
    } catch (err) {
      console.error('Error creating shipment:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 py-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">🚢 Add New Shipment</h2>
          <p className="text-blue-100">Fill in all required shipment details</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Shipment ID *</label>
                <input
                  name="shipmentId"
                  value={formData.shipmentId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="SHIP1234"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Container ID *</label>
                <input
                  name="containerId"
                  value={formData.containerId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="CONT7890"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Current Location *</label>
                <input
                  name="currentLocation"
                  value={formData.currentLocation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="MUMBAI"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="Pending">Pending</option>
                  <option value="In transit">In transit</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Received">Received</option>
                </select>
              </div>
            </div>

            {/* Route Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Route Information</h3>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Route (comma separated) *</label>
                <input
                  name="route"
                  value={formData.route}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="MUMBAI,KOCHI,SINGAPORE"
                />
                <p className="text-xs text-gray-500 mt-1">Enter ports in order separated by commas</p>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Departure Time *</label>
                <input
                  type="datetime-local"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Estimated Delivery Time *</label>
                <input
                  type="datetime-local"
                  name="estimatedDeliveryTime"
                  value={formData.estimatedDeliveryTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Cargo Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Cargo Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Cargo Type *</label>
                <input
                  name="cargoType"
                  value={formData.cargoType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="e.g. Furniture"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Cargo Weight (kg) *</label>
                <input
                  type="number"
                  name="cargoWeight"
                  value={formData.cargoWeight}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="2000"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Cargo Description</label>
                <input
                  name="cargoDescription"
                  value={formData.cargoDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="e.g. Wooden furniture containers"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Cargo Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Shipper & Consignee */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Shipper Details</h3>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Shipper Name *</label>
                <input
                  name="shipperName"
                  value={formData.shipperName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="e.g. ABC Furnishings Ltd"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Shipper Contact *</label>
                <input
                  name="shipperContact"
                  value={formData.shipperContact}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Consignee Details</h3>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Consignee Name *</label>
                <input
                  name="consigneeName"
                  value={formData.consigneeName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="e.g. HomeWorld Exports"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Consignee Contact *</label>
                <input
                  name="consigneeContact"
                  value={formData.consigneeContact}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="e.g. 8123456789"
                />
              </div>
            </div>
          </div>

          {/* Vessel Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Vessel Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Vessel Name</label>
                <input
                  name="vesselName"
                  value={formData.vesselName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="e.g. Pacific Star"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Voyage Number</label>
                <input
                  name="voyageNumber"
                  value={formData.voyageNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="e.g. PS334W"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/shipments')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShipmentForm;