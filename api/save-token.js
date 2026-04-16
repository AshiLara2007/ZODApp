// api/save-token.js
let tokens = [];

export default async function handler(req, res) {
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
      
      const exists = tokens.find(t => t.token === token);
      if (!exists) {
        tokens.push({ token, language, createdAt: new Date().toISOString() });
      }
      
      return res.status(200).json({ success: true, tokensCount: tokens.length });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save token' });
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({ tokens: tokens.map(t => t.token) });
  }

  res.status(405).json({ error: 'Method not allowed' });
}