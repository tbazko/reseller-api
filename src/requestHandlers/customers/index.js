import catchError from '../../utils/catchError';
import postCustomersLogin from './postCustomersLogin';
import postCustomersLogout from './postCustomersLogout';
import postCustomersRegister from './postCustomersRegister';
import postCustomersDomain from './postCustomersDomain';
import getCustomer from './getCustomer';


export default (router) => {
  router.post('/customers/register', catchError(postCustomersRegister));
  router.post('/customers/login', catchError(postCustomersLogin));
  router.post('/customers/logout', catchError(postCustomersLogout));
  router.post('/customers/domain', catchError(postCustomersDomain));

  router.get('/customers/:id', catchError(getCustomer));
};
