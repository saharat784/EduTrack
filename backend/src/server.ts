import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Root Welcome
app.get('/', (_req, res) => {
  res.json({
    app: 'EduTrack Performance System Backend API',
    version: '1.0.0',
    developer: 'Saharath Wiangkaew',
    docs: '/api/health',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 EduTrack Backend Server running at http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
