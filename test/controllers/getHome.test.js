import { assert } from 'chai';
import { get } from '../helpers';

suite('GET /', function () {
  test('should return JSON in body', async () => {
    const { body } = await get('/', 200);
    assert.deepEqual(body, { name: 'Home' });
  });
});