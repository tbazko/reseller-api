import knex, { migrate } from '../src/services/knex';

suiteSetup(() => {
  return knex.migrate.rollback();
});

setup(() => {
  return migrate();
});

teardown(() => {
  return knex.migrate.rollback();
});
