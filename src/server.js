
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRouter from './routes/notesRoutes.js';
import { errors as celebrateErrors } from 'celebrate';

const app = express();
const PORT = process.env.PORT ?? 3000;

// ===== Global middleware =====
app.use(logger);
app.use(cors());
app.use(express.json());

// ===== Routes =====
app.use(notesRouter);

// ===== 404 =====
app.use(notFoundHandler);

// ===== Celebrate validation errors =====
app.use(celebrateErrors());

// ===== Global error handler =====
app.use(errorHandler);

// ===== Start server =====
const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
