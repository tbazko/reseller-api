import { insert } from '../../repositories/customers';
import { conflictError } from '../../utils/errors';

/**
 * POST /customers/register
 */
export default async function postCustomersRegister(req, res) {
  try {
    await insert(req.body);
  } catch (err) {
    if (err.name === 'UserExistsError') {
      throw conflictError();
    }
    throw err;
  }
  res.status(201);
}
