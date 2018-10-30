import catchError from '../../utils/catchError';
import postCustomersRegister from './postCustomersRegister';
import postCustomersLogin from './postCustomersLogin';

export default (router) => {
  router.post('/customers/register', catchError(postCustomersRegister));
  router.post('/customers/login', catchError(postCustomersLogin))
};
