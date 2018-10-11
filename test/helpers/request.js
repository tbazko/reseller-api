import request from 'supertest';
import { server } from '../../src/server';

export function get(url, status, headers = {}) {
  return request(server)
    .get(url)
    .set('Accept', 'application/json')
    .set(headers)
    .expect(status);
}