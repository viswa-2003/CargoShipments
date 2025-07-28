const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const shipmentRoutes = require('./routes/shipmentRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', shipmentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

