const express = require('express');
const cors = require('cors');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { initializeDatabase, cleanupExpiredFiles } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/', apiLimiter);
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize API routes
const uploadRoute = require('./api/upload');
const downloadRoute = require('./api/download');
const adminRoute = require('./api/admin');

app.use('/api/upload', uploadRoute);
app.use('/api/download', downloadRoute);
app.use('/api/admin', adminRoute);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Clean up expired files on startup
    cleanupExpiredFiles();
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
