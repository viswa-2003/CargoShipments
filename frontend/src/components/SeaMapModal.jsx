import React, { useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom ship icon
const shipIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Global Ports Database (Indian + International)
const globalPorts = {
  // Indian Ports
  Kolkata: [22.5726, 88.3639],
  Visakhapatnam: [17.6868, 83.2185],
  Chennai: [13.0827, 80.2707],
  Kochi: [9.9312, 76.2673],
  Goa: [15.2993, 74.1240],
  Mumbai: [19.0760, 72.8777],
  Delhi: [28.6139, 77.2090],
  Hyderabad: [17.3850, 78.4867],
  Bangalore: [12.9716, 77.5946],
  
  // International Ports
  Singapore: [1.3521, 103.8198],
  Colombo: [6.9271, 79.8612],
  Dubai: [25.2769, 55.2962],
  JebelAli: [24.9857, 55.0263],
  Shanghai: [31.2304, 121.4737],
  HongKong: [22.3193, 114.1694],
  Rotterdam: [51.9225, 4.47917],
  Hamburg: [53.5511, 9.9937],
  Antwerp: [51.2194, 4.4025],
  LosAngeles: [33.7701, -118.1937],
  LongBeach: [33.7701, -118.1937],
  NewYork: [40.7128, -74.0060],
  Santos: [-23.9608, -46.3339],
  Durban: [-29.8833, 31.0499],
  Melbourne: [-37.8136, 144.9631],
  Sydney: [-33.8688, 151.2093],
  Tokyo: [35.6762, 139.6503],
  Yokohama: [35.4437, 139.6380],
  Busan: [35.1796, 129.0756],
};

// Port distance database (nautical miles)
const portDistances = {
  'Mumbai-Singapore': 1800,
  'Singapore-Colombo': 1200,
  'Colombo-Dubai': 1600,
  'Dubai-Rotterdam': 4200,
  'Rotterdam-Hamburg': 300,
  'Hamburg-Antwerp': 250,
  'Singapore-HongKong': 1300,
  'HongKong-Shanghai': 800,
  'Shanghai-Tokyo': 1100,
  'Tokyo-Yokohama': 20,
  'Yokohama-Busan': 600,
  'Busan-Shanghai': 500,
  'LosAngeles-LongBeach': 20,
  'LongBeach-Sydney': 6500,
  'Sydney-Melbourne': 500,
  'Mumbai-Colombo': 700,
  'Colombo-Singapore': 1200,
  'NewYork-Rotterdam': 3400,
  'Santos-Durban': 3800,
  'Durban-Mumbai': 4200,
};

const getPortCoords = (city) => {
  if (globalPorts[city]) return globalPorts[city];
  
  const lowerCity = city.toLowerCase();
  const foundKey = Object.keys(globalPorts).find(
    key => key.toLowerCase() === lowerCity
  );
  
  return foundKey ? globalPorts[foundKey] : [20.5937, 78.9629];
};

function MapController({ positions }) {
  const map = useMap();
  const initialized = useRef(false);

  useEffect(() => {
    if (positions.length > 1 && !initialized.current) {
      const timer = setTimeout(() => {
        map.fitBounds(L.latLngBounds(positions), {
          padding: [50, 50],
          animate: false
        });
        initialized.current = true;
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [positions, map]);

  return null;
}

function generateSeaRoute(route) {
  if (!route || route.length < 2) return [];
  
  const fullRoute = [];
  
  for (const port of route) {
    const coords = getPortCoords(port);
    if (coords) fullRoute.push(coords);
  }
  
  return fullRoute;
}

function RouteInfoPanel({ route, currentLocation }) {
  const calculateRouteTime = useCallback(() => {
    const averageSpeed = 18;
    let totalDistance = 0;
    let segments = [];
    let completedSegments = 0;
    
    for (let i = 0; i < route.length - 1; i++) {
      const from = route[i];
      const to = route[i+1];
      const key = `${from}-${to}`;
      const distance = portDistances[key] || 1000;
      totalDistance += distance;
      
      const hours = distance / averageSpeed;
      const isCompleted = route.indexOf(currentLocation) > i;
      if (isCompleted) completedSegments++;
      
      segments.push({
        from,
        to,
        distance,
        hours: Math.round(hours),
        days: Math.round(hours / 24 * 10) / 10,
        completed: isCompleted
      });
    }
    
    const remainingRoute = route.slice(route.indexOf(currentLocation));
    let remainingDistance = 0;
    
    for (let i = 0; i < remainingRoute.length - 1; i++) {
      const from = remainingRoute[i];
      const to = remainingRoute[i+1];
      const key = `${from}-${to}`;
      remainingDistance += portDistances[key] || 1000;
    }
    
    const remainingHours = remainingDistance / averageSpeed;
    const eta = new Date();
    eta.setHours(eta.getHours() + remainingHours);
    
    return {
      totalDistance,
      totalHours: Math.round(totalDistance / averageSpeed),
      totalDays: Math.round(totalDistance / averageSpeed / 24 * 10) / 10,
      segments,
      completedSegments,
      progress: (completedSegments / (route.length - 1)) * 100,
      remainingDistance,
      remainingHours: Math.round(remainingHours),
      remainingDays: Math.round(remainingHours / 24 * 10) / 10,
      eta
    };
  }, [route, currentLocation]);

  const routeInfo = calculateRouteTime();

  return (
    <div className="absolute bottom-4 left-4 bg-black p-4 rounded-lg shadow-md z-[1000] max-w-xs border border-gray-200">
      <h3 className="font-bold mb-2 text-lg">Route Information</h3>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-pink-500 p-2 rounded">
          <div className="text-xs text-green-500">Total Distance</div>
          <div className="font-semibold">{routeInfo.totalDistance} nm</div>
        </div>
        <div className="bg-blue-500 p-2 rounded">
          <div className="text-xs text-green-500">Total Time</div>
          <div className="font-semibold">{routeInfo.totalDays} days</div>
        </div>
        <div className="bg-yellow-500 p-2 rounded">
          <div className="text-xs text-green-500">Remaining</div>
          <div className="font-semibold">{routeInfo.remainingDays} days</div>
        </div>
        <div className="bg-purple-500 p-2 rounded">
          <div className="text-xs text-green-500">ETA</div>
          <div className="font-semibold">
            {routeInfo.eta.toLocaleDateString()}
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${routeInfo.progress}%` }}
        ></div>
      </div>
      <div className="text-sm text-center mb-3">
        <span className="font-medium">{currentLocation}</span> ({Math.round(routeInfo.progress)}% complete)
      </div>
      
      <div className="mt-2 max-h-40 overflow-y-auto pr-2">
        <h4 className="font-semibold text-sm mb-1 border-b pb-1">Route Segments:</h4>
        {routeInfo.segments.map((seg, i) => (
          <div 
            key={i} 
            className={`text-xs mb-1 p-1 rounded ${seg.completed ? 'bg-blue-500 line-through text-green-700' : 'bg-gray-500'}`}
          >
            <span className="font-medium">{seg.from} → {seg.to}:</span> {seg.distance}nm ({seg.days}d)
          </div>
        ))}
      </div>
    </div>
  );
}

const SeaMapModal = ({ isOpen, onClose, route = [], currentLocation }) => {
  const mapContainerRef = useRef(null);
  const seaPath = generateSeaRoute(route);
  const currentCoord = getPortCoords(currentLocation);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            🌍 Shipping Route: {route?.join(' → ')}
          </h2>
          <div className="text-sm text-gray-600">
            Current Location: <span className="font-semibold">{currentLocation}</span>
          </div>
        </div>
        
        <div 
          ref={mapContainerRef}
          className="w-full h-[70vh] min-h-[400px] relative"
        >
          <MapContainer
            center={currentCoord}
            zoom={3}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            className="rounded-b-xl"
            whenReady={() => {
              if (mapContainerRef.current) {
                mapContainerRef.current.style.willChange = 'auto';
              }
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              updateWhenIdle={true}
              keepBuffer={5}
            />

            <MapController positions={seaPath} />

            <Polyline 
              positions={seaPath} 
              color="#3b82f6" 
              weight={4}
              opacity={0.8}
            />

            {route.map((city, index) => (
              <Marker key={`port-${index}`} position={getPortCoords(city)}>
                <Popup>
                  {index === 0 ? '🚢 Departure: ' : 
                   index === route.length - 1 ? '🏁 Destination: ' : '⚓ Port: '}
                  {city}
                </Popup>
              </Marker>
            ))}

            <Marker position={currentCoord} icon={shipIcon}>
              <Popup>
                <div className="font-semibold">
                  🚢 Current Location: <strong>{currentLocation}</strong>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Next stop: {route[route.indexOf(currentLocation) + 1] || 'Destination'}
                </div>
              </Popup>
            </Marker>

            <RouteInfoPanel route={route} currentLocation={currentLocation} />
          </MapContainer>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          aria-label="Close map"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default SeaMapModal;