import catchError from '../../utils/catchError';
import getDomainsAvailable from './getDomainsAvailable';

export default (router) => {
  router.get('/domains/available', catchError(getDomainsAvailable));
};
