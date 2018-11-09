import { Router } from 'express';
import bodyParser from 'body-parser';
import home from './requestHandlers/home';
import customers from './requestHandlers/customers';
import domains from './requestHandlers/domains';

export default function () {
  const apiRouter = Router();

  apiRouter.use(bodyParser.json());
  apiRouter.use(bodyParser.urlencoded({ extended: false }));

  home(apiRouter);
  customers(apiRouter);
  domains(apiRouter);

  return apiRouter;
}
