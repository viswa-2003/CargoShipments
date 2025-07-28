import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import shipSound from '../assets/ship-horn.mp3';
import backgroundVideo from '../assets/cargo-intro.mp4'; // Add your intro video here
import '../Pages/HomePage.css'; // Import your custom CSS for ocean waves

const HomePage = () => {
  useEffect(() => {
    const audio = new Audio(shipSound);
    audio.play().catch(e => console.log("Auto-play blocked:", e));
  }, []);

  return (
    <div className="home-container relative w-full min-h-screen overflow-hidden text-white font-sans">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10 glitter-overlay" />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-20 space-y-10">
        <h1 className="text-5xl font-bold leading-tight sparkle-text">
          🚢 Welcome to Cargo Shipment Tracker
        </h1>
        <p className="max-w-3xl text-xl text-gray-200 sparkle-text">
          A smarter way to track cargo across oceans. Real-time updates, live map views,
          image uploads, and a seamless experience to manage all your cargo.
        </p>

        {/* Buttons */}
        <div className="flex space-x-4 mt-6">
          <Link
            to="/add"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg text-lg font-semibold transition"
          >
            ➕ Add Shipment
          </Link>
          <Link
            to="/shipments"
            className="bg-white hover:bg-gray-100 text-blue-800 px-6 py-3 rounded-lg text-lg font-semibold transition"
          >
            📦 View Shipments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;