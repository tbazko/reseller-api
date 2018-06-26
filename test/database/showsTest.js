import { assert } from 'chai';
import * as dbShows from '../../src/database/shows';

suite('Database shows', () => {
  test('insert if not exists', async () => {
    const resp = await dbShows.insert({ id: 1, name: 'Test' });
    const resp2 = await dbShows.insert({ id: 2, name: 'Test' });
    const resp3 = await dbShows.insert({ id: 2, name: 'Test' });
    assert.equal(resp[0], 1);
    assert.equal(resp2[0], 2);
    assert.isEmpty(resp3);
  });
});
