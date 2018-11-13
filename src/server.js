import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import gracefulExit from 'express-graceful-exit';
import session from 'express-session';
import connectRedis from 'connect-redis';
import bodyParser from 'body-parser';
import errorHandler from './middleware/errorHandler';
import { notFoundError } from './utils/errors';
import apiRouter from './apiRouter';
import { passport } from './middleware/authentication';

const RedisStore = connectRedis(session)
const allowedClient = process.env.ALLOWED_CLIENT || 'http://localhost:3000';

const app = express();
app.use(gracefulExit.middleware(app));
app.use(cors({
  origin: `${allowedClient}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({
    url: process.env.NODE_ENV === 'production' ? process.env.REDIS_URL :'redis://localhost:6379',
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