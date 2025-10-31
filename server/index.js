const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env regardless of CWD, before loading routes
dotenv.config({ path: path.resolve(__dirname, '.env') });

const notesRoutes = require('./routes/notes');
const notionRoutes = require('./routes/notion');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/notes', notesRoutes);
app.use('/api/notion', notionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mentor Connect API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler (Express 5 compatible - no wildcard string)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Notes API available at http://localhost:${PORT}/api/notes`);
  console.log(`🔗 Notion API available at http://localhost:${PORT}/api/notion`);
});

module.exports = app;
