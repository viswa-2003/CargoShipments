// config.js
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api',
    UPLOADS_BASE_URL: 'http://localhost:5000/uploads'
  },
  production: {
    API_BASE_URL: 'https://cargo-backend-6yps.onrender.com/api',
    UPLOADS_BASE_URL: 'https://cargo-backend-6yps.onrender.com/uploads'
  }
};

// Export active configuration
export const API_BASE_URL = config[isProduction ? 'production' : 'development'].API_BASE_URL;
export const UPLOADS_BASE_URL = config[isProduction ? 'production' : 'development'].UPLOADS_BASE_URL;

// Enhanced helper functions
export const getApiUrl = (path = '') => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
export const getUploadsUrl = (filename) => {
  if (!filename) return null;
  
  // Normalize path and handle all cases:
  // - "image.jpg"
  // - "/uploads/image.jpg" 
  // - "C:\\temp\\uploads\\image.jpg"
  const normalized = filename.replace(/^.*[\\/]/, '');
  return `${UPLOADS_BASE_URL}/${encodeURIComponent(normalized)}`;
};

// New: Get complete upload endpoint URL
export const getUploadEndpoint = () => `${API_BASE_URL}/upload`;
export const getShipmentUrl = (id) => `${API_BASE_URL}/shipments/${id}`; 