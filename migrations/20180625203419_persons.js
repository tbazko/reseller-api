exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('persons', function (table) {
      table.string('id').notNullable().primary();
      table.string('name');
      table.string('birthday');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('persons'),
  ]);
};
