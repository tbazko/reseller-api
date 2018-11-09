import { badRequestError } from '../../utils/errors';

/**
 * POST /customers/logout
 */
export default async function postLogout(req, res) {
  if (!req.isAuthenticated()) {
    throw badRequestError('User is not signed in', 400);
  }

  req.logout();
  res.status(200).send();
}
