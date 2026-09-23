const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const recipeRoutes = require('./routes/recipeRoutes');
const ttsRoutes = require('./routes/ttsRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', recipeRoutes);
app.use('/api', ttsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'BeChef API',
    author: 'Ngự Võ',
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static assets if production build exists
const clientDistPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDistPath));

// Fallback to index.html for SPA client routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).send('BeChef API Server Running. Frontend build pending.');
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`BeChef Server running on port ${PORT}`);
  });
}

module.exports = app;
