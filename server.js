// server.js
const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const { protect } = require('./middleware/auth');
const cors = require('cors');
const multer = require('multer');
const Minio = require('minio');

const app = express();

// Connect to database
connectDB();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Authentication Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Product Routes
app.use('/api/product', require('./routes/productRoutes'));

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
