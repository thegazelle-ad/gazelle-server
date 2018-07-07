/* eslint-disable */
'use strict';

const path = require('path');
const envVars = require('dotenv').config().parsed;

const databaseConnectionConfig = {
  user: envVars.DATABASE_USER,
  host: envVars.DATABASE_HOST,
  database: envVars.DATABASE_NAME,
  password: envVars.DATABASE_PASSWORD,
  encoding: envVars.DATABASE_ENCODING,
};

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
