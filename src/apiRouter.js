import { Router } from 'express';
import bodyParser from 'body-parser';
import home from './controllers/home';
import customers from './controllers/customers';

export default function () {
  const apiRouter = Router();

  apiRouter.use(bodyParser.json());
  apiRouter.use(bodyParser.urlencoded({ extended: false }));

  home(apiRouter);
  customers(apiRouter);

  return apiRouter;
}
