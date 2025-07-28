import React from 'react';

const About = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen py-16 px-6 md:px-20 relative">
      {/* Developer Badge */}
      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow text-sm text-blue-600 font-medium">
        Project by TAMADA VISWANADHAM
      </div>

      <div className="max-w-6xl mx-auto bg-white p-10 rounded-lg shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6 text-center">
          🚢 About Cargo Shipment Tracker
        </h1>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed text-justify">
          <strong>Cargo Shipment Tracker</strong> is a smart and intuitive web application designed to manage and track cargo shipments between Indian coastal cities and international ports using oceanic routes such as the <strong>Bay of Bengal</strong> and the <strong>Arabian Sea</strong>. Built on the robust MERN stack, this project delivers real-time shipment tracking and efficient logistics management.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div className="bg-blue-100 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">🌐 Supported Ports</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-blue-600">Indian Ports:</h3>
                <ul className="list-disc ml-6 text-gray-800 space-y-1">
                  <li>Mumbai (West Coast)</li>
                  <li>Chennai (East Coast)</li>
                  <li>Kolkata (East Coast)</li>
                  <li>Kochi (West Coast)</li>
                  <li>Visakhapatnam (East Coast)</li>
                  <li>Mangalore (West Coast)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-600">International Ports:</h3>
                <ul className="list-disc ml-6 text-gray-800 space-y-1">
                  <li>Singapore (Asia)</li>
                  <li>Colombo (Sri Lanka)</li>
                  <li>Dubai (UAE)</li>
                  <li>Rotterdam (Europe)</li>
                  <li>Shanghai (China)</li>
                  <li>Los Angeles (USA)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">📊 Shipment Status Guide</h2>
            <ul className="list-disc ml-6 text-gray-800 space-y-2">
              <li><strong>Pending:</strong> Shipment is registered but not yet departed</li>
              <li><strong>In transit:</strong> Ship is currently moving between ports</li>
              <li><strong>Delayed:</strong> Shipment is behind schedule due to weather or other issues</li>
              <li><strong>Delivered:</strong> Cargo has reached final destination port</li>
              <li><strong>Received:</strong> Cargo has been collected by consignee</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-10">
          <div className="bg-blue-100 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">🔧 Technologies Used</h2>
            <ul className="list-disc ml-6 text-gray-800 space-y-1">
              <li><strong>Frontend:</strong> React.js + Tailwind CSS</li>
              <li><strong>Backend:</strong> Node.js & Express.js</li>
              <li><strong>Database:</strong> MongoDB Atlas (Cloud)</li>
              <li><strong>Map API:</strong> Leaflet with OpenStreetMap</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm text-blue-600">Developed by TAMADA VISWANADHAM</p>
              <p className="text-xs text-blue-500">Full Stack Developer</p>
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">🚀 Key Features</h2>
            <ul className="list-disc ml-6 text-gray-800 space-y-1">
              <li>📦 Add and track cargo shipment records</li>
              <li>🗺️ Live map view with route visualization</li>
              <li>📍 See the ship's live position (emoji marker)</li>
              <li>🖼️ Upload cargo images as evidence or reference</li>
              <li>🔒 REST API integration with real-time MongoDB sync</li>
              <li>⏱️ Estimated Time of Arrival (ETA) calculations</li>
            </ul>
          </div>
        </div>

        {/* Development Team Section */}
        <div className="bg-blue-50 rounded-lg p-6 shadow-md mb-10">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">👨‍💻 Development Team</h2>
          <div className="flex items-center space-x-6 p-4 bg-white rounded-lg">
            <div className="bg-blue-100 p-4 rounded-full">
              <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-800">TAMADA VISWANADHAM</h3>
              <p className="text-blue-600">Full Stack Developer</p>
              <div className="flex space-x-4 mt-2">
                <a href="mailto:vijaytamada333@email.com" className="text-sm text-blue-500 hover:underline flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email
                </a>
                <a href="https://github.com/viswa-2003" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-l-4 border-blue-600 p-6 rounded-md shadow">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">🌍 Project Context</h3>
          <p className="text-gray-700 leading-relaxed">
            Developed as part of MERN STACK at ADITYA COLLEGE OF ENGINEERING AND TECHNOLOGY, this application demonstrates modern web development practices with a focus on logistics management.
          </p>
        </div>

        <div className="text-center mt-12">
          <p className="text-lg font-medium text-blue-700">Built with 💙 by TAMADA VISWANADHAM</p>
          <p className="text-sm text-gray-500 mt-2">
            © {new Date().getFullYear()} Cargo Shipment Tracker | All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;