import { passport, login } from '../../middleware/authentication';
import { unauthorizedError } from '../../utils/errors';

/**
 * POST /customers/login
 */
export default async function postCustomersLogin(req, res, next) {
  return passport.authenticate('local', async (error, customer, info) => {
    if (error) {
      return next(error);
    }

    if (!customer) {
      return next(unauthorizedError(info.message));
    }

    try {
      await login(req, customer);
      res.status(200).json(customer);
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
}
