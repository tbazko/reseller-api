import { getCustomerById } from '../../repositories/customers';
import { notFoundError, unauthorizedError } from '../../utils/errors';

/**
 * GET /customers/self
 */
export default async function getCustomersSelf(req, res) {
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
