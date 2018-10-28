import catchError from '../../utils/catchError';
import postCustomersCreate from './postCustomersCreate';

export default (router) => {
  router.post('/customers/register', catchError(postCustomersCreate));
};
