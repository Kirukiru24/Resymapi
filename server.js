const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
// Configure CORS
// Configure CORS
const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:5173', // Adding Vite default local port
    'https://resymonline.onrender.com' // Your actual production frontend URL
];

app.use(cors({ 
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
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