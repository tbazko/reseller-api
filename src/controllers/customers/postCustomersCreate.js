import { insert } from '../../repositories/customers';
import { conflictError } from '../../utils/errors';

/**
 * POST /customers/register
 */
export default async function postCustomersCreate(req, res) {
  try {
    await insert(req.body);
  } catch (err) {
    // 23505 = unique constraint errors
    if (err.code === '23505' && err.message.substring('customers_email_unique') > -1) {
      throw conflictError('Email is already in use');
    }
    throw err;
  }
  res.status(201);
}
