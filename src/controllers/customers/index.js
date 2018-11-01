import catchError from '../../utils/catchError';
import postCustomersLogin from './postCustomersLogin';
import postCustomersRegister from './postCustomersRegister';
import getCustomer from './getCustomer';


export default (router) => {
  router.post('/customers/register', catchError(postCustomersRegister));
  router.post('/customers/login', catchError(postCustomersLogin));

  router.get('/customers/:id', catchError(getCustomer));
};
