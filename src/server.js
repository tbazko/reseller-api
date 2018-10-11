import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import gracefulExit from 'express-graceful-exit';
import errorHandler from './middleware/errorHandler';
import { notFoundError } from './utils/errors';
import apiRouter from './apiRouter';

const app = express();
app.use(gracefulExit.middleware(app));
app.use(cors());
app.use(morgan('dev'));

app.use('/', apiRouter());

app.use((req, res, next) => {
  next(notFoundError());
});

app.use(errorHandler);

export const PORT = process.env.PORT || 3000;
export const server = http.createServer(app);