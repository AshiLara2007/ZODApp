// api/talents.js
<<<<<<< HEAD
let talents = [];
=======
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');
const TOKENS_FILE = path.join(process.cwd(), 'tokens.json');

// Initialize data file if not exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}
>>>>>>> b6c086cd0dcb2fe1f0b2f5909dafa60806e532b6

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
<<<<<<< HEAD
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

=======
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
>>>>>>> b6c086cd0dcb2fe1f0b2f5909dafa60806e532b6
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

<<<<<<< HEAD
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
=======
  // GET - Fetch all talents
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const talents = JSON.parse(data);
      res.status(200).json(talents);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read data' });
    }
  }
  
  // POST - Add new talent and send notifications
  else if (req.method === 'POST') {
    try {
      // Read existing data
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const talents = JSON.parse(data);
      
      // Get form data
      const formData = req.body;
      const newTalent = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      
      // Add new talent
      talents.push(newTalent);
      fs.writeFileSync(DATA_FILE, JSON.stringify(talents, null, 2));
      
      // Send notifications to all users
      let tokens = [];
      if (fs.existsSync(TOKENS_FILE)) {
        const tokenData = fs.readFileSync(TOKENS_FILE, 'utf8');
        tokens = JSON.parse(tokenData);
      }
      
      // Send notification to each token
      for (const tokenObj of tokens) {
        const message = {
          to: tokenObj.token,
          sound: 'default',
          title: 'New Candidate Added! 🎉',
          body: `${newTalent.name} - ${newTalent.job} from ${newTalent.country} is now available`,
          data: { screen: 'Home', candidateId: newTalent.id },
        };
        
        try {
          await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
          });
        } catch (error) {
          console.error('Failed to send notification:', error);
        }
      }
      
      res.status(200).json({ success: true, talent: newTalent });
    } catch (error) {
      console.error('Error adding talent:', error);
      res.status(500).json({ error: 'Failed to add talent' });
    }
  }
  
  // DELETE - Remove talent
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      let talents = JSON.parse(data);
      talents = talents.filter(t => t.id !== id);
      fs.writeFileSync(DATA_FILE, JSON.stringify(talents, null, 2));
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete talent' });
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
>>>>>>> b6c086cd0dcb2fe1f0b2f5909dafa60806e532b6
