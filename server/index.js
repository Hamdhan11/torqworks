import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDBStatus } from './config/db.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.join(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect Database (MongoDB or Embedded Persistence Engine fallback)
connectDB();

// Root API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'TORQWORKS ERP Backend',
    database: getDBStatus(),
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api', apiRoutes);

// Serve static frontend client when built
app.use(express.static(CLIENT_DIST));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(CLIENT_DIST, 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 TORQWORKS ERP API Server running on port ${PORT}`);
  console.log(`🏭 Database: ${getDBStatus().type}`);
  console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
