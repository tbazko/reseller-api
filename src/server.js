import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import gracefulExit from 'express-graceful-exit';
import session from 'express-session';
import connectRedis from 'connect-redis';
import errorHandler from './middleware/errorHandler';
import { notFoundError } from './utils/errors';
import apiRouter from './apiRouter';
import { passport } from './middleware/authentication';

const RedisStore = connectRedis(session)

const app = express();
app.use(gracefulExit.middleware(app));
app.use(cors());
app.use(morgan('dev'));
app.use(session({
  store: new RedisStore({
    url: 'redis://localhost:6379',
  }),
  secret: 'secret key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', apiRouter());

app.use((req, res, next) => {
  next(notFoundError());
});

app.use(errorHandler);

export const PORT = process.env.PORT || 5000;
export const server = http.createServer(app);