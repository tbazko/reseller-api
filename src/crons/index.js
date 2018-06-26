import * as _ from 'lodash';
import * as tvApi from '../services/tvApi';
import * as dbShows from '../database/shows';
import * as dbPersons from '../database/persons';

const PARALLEL_CALLS_TO_API = 1;
const PARALLEL_CALLS_TO_DB = 1;
let showsFromApi = [];

export async function scrapeData() {
  showsFromApi = showsFromApi.length === 0 ? await tvApi.fetchShows() : showsFromApi;
  const batch = showsFromApi.splice(0, 10);

  // limit the number of parallel calls to redeem the vouchers.
  return _.chunk(batch, PARALLEL_CALLS_TO_API)
    .reduce((promise, shows) =>
      promise.then(() => Promise.all(shows.map(saveWithCast))), Promise.resolve());
}

async function saveWithCast(show) {
  try {
    await dbShows.insert({ id: show.id, name: show.name });
    await fetchAndSaveCast(show.id);
  } catch (err) {
    console.log(`Insert failed for ${show.id}`, err);
  }
}

async function fetchAndSaveCast(showId) {
  const actorsFromApi = await tvApi.fetchCastForShow(showId);
  await _.chunk(actorsFromApi, PARALLEL_CALLS_TO_DB)
    .reduce((promise, actors) =>
      promise.then(() => Promise.all(
        actors.map(actor => saveActorAndRelateToShow(actor, showId))),
      ), Promise.resolve());
}

async function saveActorAndRelateToShow(actor, showId) {
  const { id, name, birthday } = actor.person;

  try {
    await dbPersons.insert({ id, name, birthday });
    await dbPersons.relateToShow(id, showId);
  } catch (err) {
    console.log(`Relate insert failed for actor ${id} and show ${showId}`, err);
  }
}
