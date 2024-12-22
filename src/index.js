const express = require('express');
const cors = require('cors');
const path = require('path');
const subscriberService = require('./services/subscriberService');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Statik dosyaları sunmak için
app.use(express.static('public'));

// Ana sayfa yönlendirmesi
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Subscribe endpoint
app.post('/subscribe', async (req, res) => {
  try {
    const { contact, type } = req.body;
    const result = await subscriberService.subscribe(contact, type);
    res.json({ success: true, subscriptionArn: result.SubscriptionArn });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Unsubscribe endpoint
app.post('/unsubscribe', async (req, res) => {
  try {
    const { subscriptionArn } = req.body;
    await subscriberService.unsubscribe(subscriptionArn);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send message endpoint
app.post('/send-message', async (req, res) => {
  try {
    const { message, type, recipients } = req.body;
    const result = await subscriberService.sendMessage(message, type, recipients);
    res.json({ success: true, messageId: result.MessageId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});