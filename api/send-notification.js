// api/send-notification.js
let tokens = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, body, data } = req.body;
    
    // Get tokens from memory
    const activeTokens = tokens.map(t => t.token);
    
    if (activeTokens.length === 0) {
      return res.status(200).json({ success: true, message: 'No tokens to send' });
    }

    // Send notifications
    const results = [];
    for (const token of activeTokens) {
      const message = {
        to: token,
        sound: 'default',
        title: title || 'ZOD Manpower',
        body: body || 'New candidate available!',
        data: data || { screen: 'Home' },
      };

      try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message),
        });
        const result = await response.json();
        results.push({ token, success: true, result });
      } catch (error) {
        results.push({ token, success: false, error: error.message });
      }
    }

    return res.status(200).json({ success: true, results });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
}