const db = require('../db');

async function validateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }
  
  try {
    const result = await db.query('SELECT * FROM admins WHERE api_key = $1', [apiKey]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    next();
  } catch (error) {
    console.error('Error validating API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  validateApiKey
};
