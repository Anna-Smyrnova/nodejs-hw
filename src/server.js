import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';


const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());

app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),

);


// GET-запит до "/notes"
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: "Retrieved all notes"
  });
});

// GET-запит  "/notes/:noteId"
app.get( '/notes/:noteId', (req, res) => {
  const {id_param} = req.params;
  res.status(200).json({
	"message": `Retrieved note with ID: ${id_param}`
  });
});


// test-error
app.get('/test-error', (req, res) => {
  throw new Error('Simulated server error');
});


// Middleware 404
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
   });
});

// Middleware 500
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const isProd = process.env.NODE_ENV === "production";


 res.status(500).json({ message: isProd ? "Something went wrong. Please try again later." : err.message,
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
