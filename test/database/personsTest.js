import { assert } from 'chai';
import * as dbPersons from '../../src/database/persons';
import * as dbShows from '../../src/database/shows';

suite('Database persons', () => {
  test('insert if not exists', async () => {
    const resp = await dbPersons.insert({ id: 1, name: 'Test', birthday: 'str' });
    const resp2 = await dbPersons.insert({ id: 2, name: 'Test', birthday: 'str' });
    const resp3 = await dbPersons.insert({ id: 2, name: 'Test', birthday: 'str' });
    assert.equal(resp[0], 1);
    assert.equal(resp2[0], 2);
    assert.isEmpty(resp3);
  });

  test('relate to show', async () => {
    await dbShows.insert({ id: 1, name: 'Test' });
    await dbPersons.insert({ id: 2, name: 'Test', birthday: 'str' });
    await dbPersons.insert({ id: 3, name: 'Test', birthday: 'str' });

    const resp1 = await dbPersons.relateToShow(2, 1);
    const resp2 = await dbPersons.relateToShow(3, 1);
    const resp3 = await dbPersons.relateToShow(2, 1);
    const resp4 = await dbPersons.relateToShow(2, 1);

    assert.deepEqual(resp1[0], { person_id: '2', show_id: '1' });
    assert.deepEqual(resp2[0], { person_id: '3', show_id: '1' });
    assert.isEmpty(resp3);
    assert.isEmpty(resp4);
  });
});
