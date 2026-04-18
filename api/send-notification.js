// api/send-notification.js
<<<<<<< HEAD
let tokens = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

=======
import fs from 'fs';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'tokens.json');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
>>>>>>> b6c086cd0dcb2fe1f0b2f5909dafa60806e532b6
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, body, data } = req.body;
    
<<<<<<< HEAD
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
=======
    // Read all tokens
    let tokens = [];
    if (fs.existsSync(TOKENS_FILE)) {
      const fileData = fs.readFileSync(TOKENS_FILE, 'utf8');
      tokens = JSON.parse(fileData);
    }
    
    if (tokens.length === 0) {
      return res.status(200).json({ success: true, message: 'No tokens to send' });
    }
    
    // Send notifications to all tokens
    const results = [];
    for (const tokenObj of tokens) {
      const message = {
        to: tokenObj.token,
>>>>>>> b6c086cd0dcb2fe1f0b2f5909dafa60806e532b6
        sound: 'default',
        title: title || 'ZOD Manpower',
        body: body || 'New candidate available!',
        data: data || { screen: 'Home' },
      };
<<<<<<< HEAD

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
=======
      
      try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        });
        
        const result = await response.json();
        results.push({ token: tokenObj.token, success: true, result });
      } catch (error) {
        results.push({ token: tokenObj.token, success: false, error: error.message });
      }
    }
    
    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
>>>>>>> b6c086cd0dcb2fe1f0b2f5909dafa60806e532b6
  }
}
