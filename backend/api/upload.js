const express = require('express');
const multer = require('multer');
const { validateApiKey } = require('../middleware/auth');
const db = require('../db');
const { generateAccessCode, calculateExpirationDate } = require('../utils/helpers');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Upload file endpoint
router.post('/', validateApiKey, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { customCode, expirationDays } = req.body;
    const fileName = req.file.originalname;
    const fileContent = req.file.buffer;
    
    // Generate or use custom access code
    const accessCode = customCode || generateAccessCode();
    
    // Calculate expiration date
    const expirationDaysNum = parseInt(expirationDays) || 7;
    const expiresAt = calculateExpirationDate(expirationDaysNum);
    
    // Store file in database
    await db.query(
      'INSERT INTO files (file_name, file_content, access_code, expires_at) VALUES ($1, $2, $3, $4)',
      [fileName, fileContent, accessCode, expiresAt]
    );
    
    res.json({ 
      success: true, 
      accessCode, 
      fileName, 
      expiresAt,
      message: `File uploaded successfully! Access code: ${accessCode}`
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});

module.exports = router;
