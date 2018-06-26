import knex from '../services/knex';

export function insert({ id, name }) {
  return knex('shows')
    .returning('id')
    .insert(knex.raw('(id, name) SELECT :id, :name WHERE NOT EXISTS (SELECT id FROM shows WHERE id=:id )', { id, name }));
}

export function fetchById(id) {
  return knex('shows')
    .where({ id })
    .first();
}

export function fetchAll() {
  return knex.select().from('shows').orderBy('id', 'asc');
}
