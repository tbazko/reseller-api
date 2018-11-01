import { getCustomerById } from '../../repositories/customers';
import { notFoundError, unauthorizedError } from '../../utils/errors';

/**
 * GET /customers/:id
 */
export default async function getCustomer(req, res) {
  console.log('getCustomer', req.user);
  if (!req.isAuthenticated()) {
    throw unauthorizedError();
  }

  let user;
  try {
    user = await getCustomerById(req.user.id);
  } catch (err) {
    throw notFoundError();
  }
  return res.status(200).json(user);
}
