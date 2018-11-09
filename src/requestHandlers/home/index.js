import catchError from '../../utils/catchError';
import getHome from './getHome';

export default (router) => {
  router.get('/', catchError(getHome));
};
