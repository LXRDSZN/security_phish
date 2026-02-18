import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './models/db.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import vesselsRoutes from './routes/vessels.routes.js';
import positionsRoutes from './routes/positions.routes.js';
import zonesRoutes from './routes/zones.routes.js';
import alertsRoutes from './routes/alerts.routes.js';

const app = express();
const port = 5000;

// Conexión a la base de datos MongoDB
await connectDB();

// Middleware para habilitar CORS 
app.use(cors({
  origin: 'http://localhost:5173',       // URL de tu frontend
  credentials: true,                     // Permite enviar cookies, si las usas
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON en el body de las peticiones
app.use(express.json());
app.use(cookieParser());

// Monta las rutas de autenticación en /api
app.use('/api', authRoutes);

// Rutas para integración con Global Fishing Watch
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/vessels', vesselsRoutes);
app.use('/api/positions', positionsRoutes);
app.use('/api/zones', zonesRoutes);
app.use('/api/alerts', alertsRoutes);

// Inicia el servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en el puerto ${port}`);
});
 