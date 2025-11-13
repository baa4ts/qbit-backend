import express from 'express';
import cookieParser from 'cookie-parser';
import usuariosRoutes from './routes/usuarios.js';
import categoriasDev from './routes/Developer.js';
import categoriasRoutes from './routes/categorias.js';
import juegosRoutes from './routes/juegos.js';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
dotenv.config({ path: "./.env" });

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['x-renewed-jwt']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger de requests
app.use(morgan('dev'));

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/dev', categoriasDev);
app.use('/api/juegos', juegosRoutes);

app.listen(80, () => console.log('Servidor corriendo en http://localhost:80'));
