exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('shows', function (table) {
      table.string('id').notNullable().primary();
      table.string('name');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('shows'),
  ]);
};
