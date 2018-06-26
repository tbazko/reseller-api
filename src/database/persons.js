import knex from '../services/knex';

export function insert({ id, name, birthday }) {
  return knex('persons')
    .returning('id')
    .insert(knex.raw('(id, name, birthday) SELECT :id, :name, :birthday WHERE NOT EXISTS (SELECT id FROM persons WHERE id=:id )', { id, name, birthday }));
}

export function fetchById(id) {
  return knex('persons')
    .where({ id })
    .first();
}

export function fetchAll() {
  return knex.select().from('persons');
}

export function relateToShow(personId, showId) {
  return knex('persons_shows')
    .returning(['person_id', 'show_id'])
    .insert(knex.raw(`(person_id, show_id) SELECT :personId, :showId
      WHERE NOT EXISTS
      (SELECT person_id FROM persons_shows WHERE person_id=:personId AND show_id=:showId )`,
    { personId, showId }));
}

export async function getManyByShowId(showId) {
  return knex.select('shows.*', 'persons.* as person_info')
    .from('shows')
    .leftJoin('persons_shows', 'persons_shows.show_id', 'shows.id')
    .leftJoin('persons', 'persons_shows.person_id', 'persons.id')
    .where('shows.id', showId)
    .orderBy('persons.birthday', 'desc')
    .then((results) => {
      return results.reduce((cast, personEntry) => {
        cast.push(personEntry);
        return cast;
      }, []);
    });
}
