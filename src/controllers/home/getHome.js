/**
 * GET /
 */
export default async function getHome(req, res) {
  res.status(200).json({
    name: 'Home',
  });
}
