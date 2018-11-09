import { saveDomainForEmail } from '../../repositories/customers';

/**
 * POST /customers/domain
 */
export default async function postCustomersDomain(req, res) {
  try {
    await saveDomainForEmail(req.body);
  } catch (err) {
    throw err;
  }
  return res.status(201).send();
}
