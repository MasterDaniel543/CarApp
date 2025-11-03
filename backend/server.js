const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // responde preflights CORS

// Log de diagnóstico
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB (Railway)
mongoose.connect(process.env.MONGO_URL || process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(' Conectado a MongoDB Railway'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api/cars', require('./routes/cars'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/users', require('./routes/users'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'Car Information API - Railway + MongoDB',
    version: '3.0.0',
    status: 'API funcionando en Railway con MongoDB integrado',
    endpoints: {
      cars: '/api/cars',
      carById: '/api/cars/:id',
      brands: '/api/cars/brands/all',
      recommended: '/api/cars/recommended/list',
      register: '/api/auth/register',
      login: '/api/auth/login',
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  // Detecta errores de parseo JSON de body-parser
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      error: 'JSON malformado',
      message: 'El cuerpo de la solicitud no es JSON válido'
    });
  }
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!', message: err.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado', message: 'La ruta solicitada no existe' });
});

// Arranque
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`API disponible en Railway`);
});