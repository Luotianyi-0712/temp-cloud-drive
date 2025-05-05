const express = require('express');
const db = require('../db');

const router = express.Router();

// Get file info without downloading
router.get('/info/:accessCode', async (req, res) => {
  try {
    const { accessCode } = req.params;
    
    const fileResult = await db.query(
      'SELECT id, file_name, created_at, expires_at, downloads FROM files WHERE access_code = $1 AND expires_at > NOW()',
      [accessCode]
    );
    
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found or expired' });
    }
    
    res.json({
      success: true,
      file: fileResult.rows[0]
    });
    
  } catch (error) {
    console.error('Error getting file info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download file
router.get('/:accessCode', async (req, res) => {
  try {
    const { accessCode } = req.params;
    
    const fileResult = await db.query(
      'SELECT * FROM files WHERE access_code = $1 AND expires_at > NOW()',
      [accessCode]
    );
    
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found or expired' });
    }
    
    const file = fileResult.rows[0];
    
    // Update download count
    await db.query(
      'UPDATE files SET downloads = downloads + 1 WHERE id = $1',
      [file.id]
    );
    
    // Send file to client
    res.setHeader('Content-Disposition', `attachment; filename="${file.file_name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(file.file_content);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
