import _ from 'lodash';
import * as dbShows from '../../database/shows';
import * as dbPersons from '../../database/persons';

/**
 * GET /shows?cursor=<id>&limit=<int>
 */
export default async function getShows(req, res) {
  const { cursor, limit } = req.query;
  let shows = await fetchShowsWithCast();
  if (cursor && limit) {
    shows = paginate(shows, req.query.cursor, req.query.limit);
  }

  res.status(200).json(shows);
}

async function fetchShowsWithCast() {
  const allShows = await dbShows.fetchAll();
  const allShowsWithCast = await fetchCastForEachShow(allShows);
  return allShowsWithCast;
}

async function fetchCastForEachShow(allShows) {
  const PARALLEL_CALLS_TO_DB = 5;
  const showsWithCast = [];
  await _.chunk(allShows, PARALLEL_CALLS_TO_DB)
    .reduce((promise, shows) =>
      promise.then(() => Promise.all(
        shows.map(fetchCastForShow)),
      ).then(results => showsWithCast.push(...results)),
    Promise.resolve());
  return showsWithCast;
}

function paginate(shows, id, limit) {
  const start = shows.findIndex(show => id === show.id);

  const end = parseFloat(limit) + start;
  return shows.slice(start, end);
}

async function fetchCastForShow(show) {
  const actors = await dbPersons.getManyByShowId(show.id);
  return { ...show, cast: actors };
}
