
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('customers', function (table) {
      table.string('id').notNullable().primary();
      table.string('name');
      table.string('lastname');
      table.string('middlename');
      table.boolean('hosting');
      table.string('email').unique();
      table.string('password');
      table.string('city');
      table.string('post_index');
      table.string('street');
      table.string('house');
      table.string('room');
      table.string('codeoperator');
      table.string('phonenumber');
      table.string('additional_info');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('customers'),
  ]);
};
