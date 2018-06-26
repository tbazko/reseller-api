import { Router } from 'express';
import bodyParser from 'body-parser';
import shows from './modules/shows';
import home from './modules/home/index';

export default function () {
  const apiRouter = Router();

  apiRouter.use(bodyParser.json());
  apiRouter.use(bodyParser.urlencoded({ extended: false }));

  home(apiRouter);
  shows(apiRouter);

  return apiRouter;
}
