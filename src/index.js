import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import { CronJob } from 'cron';
import gracefulExit from 'express-graceful-exit';
import errorHandler from './middleware/errorHandler';
import { notFoundError } from './utils/errors';
import apiRouter from './apiRouter';
import { scrapeData } from './crons';
import knex from './services/knex';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(gracefulExit.middleware(app));
app.use(cors());
app.use(morgan('dev'));

app.use('/', apiRouter());

app.use((req, res, next) => {
  next(notFoundError());
});

app.use(errorHandler);

const server = http.createServer(app);
server.on('close', () => {
  console.log('Closing HTTP server');
});

server.listen(PORT, () => {
  console.log('Server listening at http://%s:%s',
    server.address().address,
    server.address().port);
});

knex.migrate.latest()
  .then(function () {
    const cron = new CronJob('*/20 * * * * *', function () {
      console.log('Scraping starts each 20 second');
      scrapeData();
    }, null, true, 'Europe/Amsterdam');
  });

