import { Router } from 'express';
import bodyParser from 'body-parser';
import home from './controllers/home';

export default function () {
  const apiRouter = Router();

  apiRouter.use(bodyParser.json());
  apiRouter.use(bodyParser.urlencoded({ extended: false }));

  home(apiRouter);

  return apiRouter;
}
