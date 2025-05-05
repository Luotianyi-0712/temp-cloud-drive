const express = require('express');
const { validateApiKey } = require('../middleware/auth');
const db = require('../db');
const { nanoid } = require('nanoid');

const router = express.Router();

// List all files (admin only)
router.get('/files', validateApiKey, async (req, res) => {
  try {
    const filesResult = await db.query(
      'SELECT id, file_name, access_code, created_at, expires_at, downloads FROM files ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      files: filesResult.rows
    });
    
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete file (admin only)
router.delete('/files/:id', validateApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM files WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate new admin API key
router.post('/keys', validateApiKey, async (req, res) => {
  try {
    const newApiKey = nanoid(32);
    
    await db.query(
      'INSERT INTO admins (api_key) VALUES ($1)',
      [newApiKey]
    );
    
    res.json({
      success: true,
      apiKey: newApiKey
    });
    
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
