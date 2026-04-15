// api/save-token.js
import fs from 'fs';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'tokens.json');

// Initialize tokens file if not exists
if (!fs.existsSync(TOKENS_FILE)) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify([]));
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { token, language } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }
      
      // Read existing tokens
      let tokens = [];
      if (fs.existsSync(TOKENS_FILE)) {
        const data = fs.readFileSync(TOKENS_FILE, 'utf8');
        tokens = JSON.parse(data);
      }
      
      // Check if token already exists
      const existingIndex = tokens.findIndex(t => t.token === token);
      
      if (existingIndex !== -1) {
        // Update existing token
        tokens[existingIndex] = { token, language, updatedAt: new Date().toISOString() };
      } else {
        // Add new token
        tokens.push({ token, language, createdAt: new Date().toISOString() });
      }
      
      // Save back to file
      fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
      
      res.status(200).json({ success: true, message: 'Token saved successfully' });
    } catch (error) {
      console.error('Error saving token:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
      res.status(200).json({ tokens: tokens.map(t => t.token) });
    } catch (error) {
      res.status(500).json({ error: 'Failed to read tokens' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
