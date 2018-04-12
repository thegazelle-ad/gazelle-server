/* eslint-disable */
'use strict';

const path = require('path');
const fs = require('fs');
const JSON5 = require('json5');
const databaseConnectionJSON5String = fs.readFileSync(
  path.join(__dirname, 'config/database.config.json5'),
);
const databaseConnectionConfig = JSON5.parse(databaseConnectionJSON5String);

module.exports = {
  client: 'mysql',
  connection: databaseConnectionConfig,
  pool: {
    min: 10,
    max: 50,
  },
  migrations: {
    directory: path.join(__dirname, 'database-management/migrations'),
    extension: 'js',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: path.join(__dirname, 'database-management/seeds'),
    extension: 'js',
  },
};
