/**
 * This file exposes the knex configuration for the knex database migration runner.
 *
 * To target a different database change NODE_ENV to the target enviornment
 * or override using DB_*. Config values can be found in `./src/config`.
 */

require('babel-register');
const config = require('./src/services/knex').config;

module.exports = config;
