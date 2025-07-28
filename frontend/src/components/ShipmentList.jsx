import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaTrashAlt, FaShip, FaClock, FaCalendarAlt } from 'react-icons/fa';
import SeaMapModal from './SeaMapModal';

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [openMapFor, setOpenMapFor] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const fetchShipments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shipments');
      const unique = Array.from(
        new Map(response.data.data.map(item => [item._id, item])).values()
      );
      setShipments(unique);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this shipment?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/shipments/${id}`);
      alert("Shipment deleted successfully");
      setShipments(prev => prev.filter(shipment => shipment._id !== id));
    } catch (error) {
      console.error("Error deleting shipment:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In transit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Delayed': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Received': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const openMapModal = (shipmentId) => {
    const shipment = shipments.find(s => s._id === shipmentId);
    setSelectedShipment(shipment);
    setOpenMapFor(shipmentId);
  };

  const formatTimeRemaining = (eta) => {
    if (!eta) return 'Calculating...';

    const now = new Date();
    const diff = new Date(eta) - now;

    if (diff <= 0) return 'Arrived';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h remaining`;
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
        <FaShip className="inline mr-2" /> Shipment Tracking
      </h2>

      {shipments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No shipments found.</p>
          <button 
            onClick={fetchShipments}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {shipments.map((shipment) => (
            <div
              key={shipment._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
            >
              {shipment.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={`http://localhost:5000/uploads/${shipment.image.split('\\').pop()}`}
                    alt="Cargo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800 truncate">
                    {shipment.shipmentId}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-24">Container:</span>
                    <span className="truncate">{shipment.containerId}</span>
                  </div>

                  <div className="flex items-start text-gray-600">
                    <span className="font-medium w-24">Route:</span>
                    <span className="flex-1">
                      {shipment.route?.join(' → ')}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="text-blue-500 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      <span className="font-medium">Location:</span> {shipment.currentLocation}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FaClock className="text-blue-500 mr-1 flex-shrink-0" />
                    <span>
                      <span className="font-medium">Time Remaining:</span> {formatTimeRemaining(shipment.currentETA)}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="text-blue-500 mr-1 flex-shrink-0" />
                    <span>
                      <span className="font-medium">ETA:</span> {shipment.currentETA ? new Date(shipment.currentETA).toLocaleString() : 'Calculating...'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => openMapModal(shipment._id)}
                    className="text-blue-500 hover:text-blue-700 flex items-center text-sm font-medium"
                  >
                    <FaMapMarkerAlt className="mr-1" /> View Route
                  </button>

                  <button
                    onClick={() => handleDelete(shipment._id)}
                    className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium"
                  >
                    <FaTrashAlt className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedShipment && (
        <SeaMapModal
          isOpen={!!openMapFor}
          onClose={() => setOpenMapFor(null)}
          route={selectedShipment.route}
          currentLocation={selectedShipment.currentLocation}
        />
      )}
    </div>
  );
};

export default ShipmentList;
