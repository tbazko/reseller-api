import { serviceRequest } from '../lib/serviceRequest';

const hostname = 'http://api.tvmaze.com';
const method = 'GET';
const headers = {};

export async function fetchShows() {
  const uri = `${hostname}/shows`;
  return serviceRequest({ method, uri, headers });
}

export async function fetchCastForShow(showId) {
  const uri = `${hostname}/shows/${showId}/cast`;
  return serviceRequest({ method, uri, headers });
}
