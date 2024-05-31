require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { socketAuth } = require('./middleware/auth');
const config = require('config');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde .env
dotenv.config();

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Configurar CORS
app.use(cors({
  origin: 'https://sc-frontend-h5h1.onrender.com', // Cambia esto al origen de tu aplicación frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Rutas
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/likes', require('./routes/likeRoutes'));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO
const io = socketIo(server, {
  cors: {
    origin: 'https://sc-frontend-h5h1.onrender.com', // Cambia esto al origen de tu aplicación frontend
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware de autenticación para Socket.IO
io.use(socketAuth);

io.on('connection', (socket) => {  
  // Puedes guardar el ID de socket en la sesión del usuario para enviar notificaciones más tarde
  socket.on('disconnect', () => {
  });
});

// Puerto
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

module.exports = io; // Exportar io para usarlo en otros archivos
