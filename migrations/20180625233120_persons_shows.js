exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('persons_shows', function (table) {
      table.increments();
      table.string('person_id').notNullable();
      table.foreign('person_id')
        .references('persons.id')
        .onDelete('CASCADE');
      table.string('show_id').notNullable();
      table.foreign('show_id')
        .references('shows.id')
        .onDelete('CASCADE');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('persons_shows'),
  ]);
};
