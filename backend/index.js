// index.js
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const articles = [
  {
    id: 1,
    title: 'Breakthrough in Renewable Energy Technology',
    imageUrl: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=1200&auto=format&fit=crop',
    description: 'A new solar cell design promises higher efficiency at lower cost.'
  },
  {
    id: 2,
    title: 'City Launches Smart Public Transport Initiative',
    imageUrl: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1200&auto=format&fit=crop',
    description: 'The initiative will integrate real-time tracking and mobile ticketing.'
  },
  {
    id: 3,
    title: 'AI Tool Helps Farmers Predict Crop Yields',
    imageUrl: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop',
    description: 'Machine learning models analyze satellite data to forecast production.'
  },
  {
    id: 4,
    title: 'Startup Raises Series B to Expand Globally',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
    description: 'Funding will be used to scale engineering and operations.'
  },
  {
    id: 5,
    title: 'New App Simplifies Mental Health Support',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop',
    description: 'Features guided exercises and on-demand counseling connections.'
  }
];

app.get('/api/news', (req, res) => {
  res.json({ status: 'ok', count: articles.length, articles });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`News API running on port ${PORT}`);
});
