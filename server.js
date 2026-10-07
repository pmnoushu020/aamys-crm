import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI && !MONGODB_URI.includes('<db_password>')) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB Atlas successfully.');
    })
    .catch((err) => {
      console.error('⚠️ MongoDB Atlas connection error:', err.message);
    });
} else {
  console.log('ℹ️ MONGODB_URI not configured or contains placeholder. Running in standalone mode.');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'online',
    appName: 'Aamys CRM',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static files from /dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback all other routes to index.html for React SPA (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Aamys CRM production server listening on port ${PORT}`);
});
