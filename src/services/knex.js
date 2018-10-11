import knex from 'knex';

let databaseUrl = '';

if (process.env.NODE_ENV === 'production') {
  databaseUrl = '';
}

const knexConfig = {
  client: 'pg',
  debug: false,
  connection: databaseUrl,
  pool: {
    min: 1,
    max: 7,
    afterCreate: (conn, done) => {
      conn.query('SET timezone="UTC";', (err) => {
        done(err, conn);
      });
    },
  },
};

const client = knex(knexConfig);

export {
  knexConfig as config,
};
export default client;
