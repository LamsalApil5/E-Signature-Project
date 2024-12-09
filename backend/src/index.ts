import express, { Express, Request, Response } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';
import cors from 'cors';


const app: Express = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
  log: ['query'],
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('App working.');
});
