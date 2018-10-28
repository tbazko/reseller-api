exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('domains', function (table) {
      table.increments();
      table.string('owner_id').notNullable();
      table.foreign('owner_id')
        .references('customers.id')
        .onDelete('CASCADE');
      table.string('domain_name').notNullable();
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('domains'),
  ]);
};
