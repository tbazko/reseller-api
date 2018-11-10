/**
 * GET /customers/is-authenticated
 */
export default async function getCustomersIsAuthenticated(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({ isAuthenticated: false });
  }

  return res.status(200).json({ isAuthenticated: true });
}
