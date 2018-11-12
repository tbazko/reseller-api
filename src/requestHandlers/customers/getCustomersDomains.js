import { getDomainsByCustomerId } from '../../repositories/customers';
import { unauthorizedError } from '../../utils/errors';

/**
 * GET /customers/domains
 */
export default async function getCustomersDomains(req, res) {
  if (!req.isAuthenticated()) {
    throw unauthorizedError();
  }

  const domains = await getDomainsByCustomerId(req.user.id);

  return res.status(200).json({ customerDomains: domains });
}
