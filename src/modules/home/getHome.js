/**
 * GET /
 */
export default async function getHome(req, res) {
  res.status(200).json(
    {
      name: 'AMazing TV',
      seeAllShows: `Go to http://${req.hostname}/shows`,
      seePaginatedShows: `Go to http://${req.hostname}/shows?cursor=<idOfTheShow>&limit=<howManyShowsYouNeed>`,
      examplePagination: `https://${req.hostname}/shows?cursor=1&limit=3`,
    },
  );
}
