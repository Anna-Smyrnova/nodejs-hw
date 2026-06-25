import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import NotesRouter from './routes/notesRoutes.js';
import { errors } from 'celebrate';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;



// глобальні middleware
app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());


// Маршрутизатори
app.use(NotesRouter);
app.use(authRoutes);
app.use(userRoutes);


// Middleware 404
app.use(notFoundHandler);

// 3. Мідлвар від celebrate
app.use(errors());

// Middleware 500
app.use(errorHandler);




// Підключення до БД та запуск
await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
