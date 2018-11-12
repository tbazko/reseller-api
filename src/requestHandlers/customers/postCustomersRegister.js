import { insert } from '../../repositories/customers';
import { conflictError } from '../../utils/errors';
import bcrypt from 'bcrypt-nodejs';

/**
 * POST /customers/register
 */
export default async function postCustomersRegister(req, res) {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(1));
    const newUser = { ...req.body, password: hashedPassword };
    await insert(newUser);
  } catch (err) {
    if (err.name === 'UserExistsError') {
      throw conflictError();
    }
    throw err;
  }
  return res.status(201).send();
}
