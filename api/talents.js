// api/talents.js
let talents = [];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(talents);
  }

  if (req.method === 'POST') {
    try {
      const newTalent = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
      };
      talents.push(newTalent);
      return res.status(200).json({ success: true, talent: newTalent });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to add talent' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}