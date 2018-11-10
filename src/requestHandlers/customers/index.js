import catchError from '../../utils/catchError';
import postCustomersLogin from './postCustomersLogin';
import postCustomersLogout from './postCustomersLogout';
import postCustomersRegister from './postCustomersRegister';
import postCustomersDomain from './postCustomersDomain';
import getCustomersSelf from './getCustomersSelf';
import getCustomersIsAuthenticated from './getCustomersIsAuthenticated';
import getCustomersById from './getCustomersById';


export default (router) => {
  router.post('/customers/register', catchError(postCustomersRegister));
  router.post('/customers/login', catchError(postCustomersLogin));
  router.post('/customers/logout', catchError(postCustomersLogout));
  router.post('/customers/domain', catchError(postCustomersDomain));

  router.get('/customers/self', catchError(getCustomersSelf));
  router.get('/customers/is-authenticated', catchError(getCustomersIsAuthenticated));
  router.get('/customers/:id', catchError(getCustomersById));
};
