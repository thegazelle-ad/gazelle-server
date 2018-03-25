/* eslint-disable */
'use strict';

const path = require('path');
const databaseConnectionConfig = require(path.join(__dirname, 'config/database.config.js'));

module.exports = {
  client: 'mysql',
  connection: databaseConnectionConfig,
  pool: {
    min: 10,
    max: 50,
  },
  migrations: {
    directory: './migrations',
    extension: 'js',
    tableName: 'knex_migrations',
  },
};
