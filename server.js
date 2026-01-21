const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
// Configure CORS
const allowedOrigins = ['http://localhost:3000', 'https://Resym.onrender.com'];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/notifications', notificationRoutes);
// Basic Root Route for testing
app.get('/', (req, res) => {
    res.send('Weekly Reporting System API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});