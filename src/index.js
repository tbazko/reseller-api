require('babel-register');
require('babel-polyfill');

const server = require('./server').server;
const PORT = require('./server').PORT;
const migrate = require('./services/knex').migrate;

server.on('close', () => {
  console.log('Closing HTTP server');
});

migrate().then(() => {
  server.listen(PORT, () => {
    console.log(`Server listening at http://${server.address().address}:${server.address().port}`);
  });
});