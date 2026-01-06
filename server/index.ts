import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';

// Import routes
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';
import doctorRoutes from './routes/doctors';
import appointmentRoutes from './routes/appointments';
import medicalRecordRoutes from './routes/medicalRecords';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'MediNest API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to MediNest Hospital Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      patients: '/api/patients',
      doctors: '/api/doctors',
      appointments: '/api/appointments',
      medicalRecords: '/api/medical-records',
      health: '/api/health',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`🏥 MediNest Hospital Management System`);
});

export default app;
