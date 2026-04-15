// api/send-notification.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { expoPushToken, title, body, data } = req.body;

  if (!expoPushToken) {
    return res.status(400).json({ error: 'Push token is required' });
  }

  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title || 'ZOD Manpower',
    body: body || 'New candidate available!',
    data: data || { screen: 'Home' },
  };

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
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
}