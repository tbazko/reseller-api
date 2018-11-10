import knex from 'knex';
import path from 'path';

let databaseUrl = 'postgresql://tam:@127.0.0.1:5432/reseller';

if (process.env.NODE_ENV === 'production') {
  databaseUrl = `${process.env.POSTGRESQL_URL}?ssl=true`;
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

function migrate() {
  const migrationsPath = path.join(__dirname, '../..', 'migrations');
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Running database migrations from ${migrationsPath}`);
  }
  return client.migrate.latest({ directory: migrationsPath }).then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('Finished database migrations');
    }
  }).catch((err) => {
    console.log(`Failed running database migrations ${err}`);
    process.exit(1);
  });
}

export {
  knexConfig as config,
  migrate,
};
export default client;
