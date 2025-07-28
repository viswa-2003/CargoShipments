import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ShipmentList from './components/ShipmentList';
import AddShipmentForm from './components/AddShipmentForm';
import About from './components/About';
import Home from './components/Home';
import './App.css'; // ✅ Glitter effect styling

function App() {
  return (
    <div className="min-h-screen flex flex-col relative bg-black text-white font-sans sparkle-bg glitter-background overflow-hidden">
      {/* ✨ Glitter Overlay */}
      <div className="glitter-overlay pointer-events-none absolute inset-0 z-0"></div>

      {/* Header */}
      <header className="bg-blue-700 text-white py-4 shadow-md z-10 relative">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🚢 Cargo Shipment Tracker</h1>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline text-white">Home</Link>
            <Link to="/shipments" className="hover:underline text-white">All Shipments</Link>
            <Link to="/add" className="hover:underline text-white">Add Shipment</Link>
            <Link to="/about" className="hover:underline text-white">About</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 space-y-12 z-10 relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddShipmentForm />} />
          <Route path="/shipments" element={<ShipmentList />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-3 z-10 relative">
        <p className="text-sm">© 2025 Cargo Shipment Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
