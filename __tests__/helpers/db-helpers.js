// We use requireActual here in case the test calling it has mocked any
// of these modules
const path = require.requireActual('path');
const fs = require.requireActual('fs');
const JSON5 = require.requireActual('json5');
const knex = require.requireActual('knex');
const _ = require.requireActual('lodash');

const databaseConnectionJSON5String = fs.readFileSync(
  path.join(__dirname, '../../config/database.config.json5'),
);

const databaseConnectionConfig = JSON5.parse(databaseConnectionJSON5String);

export const getDatabaseConnection = databaseName => {
  const connection = databaseName
    ? {
        ...databaseConnectionConfig,
        database: databaseName,
      }
    : {
        ..._.omit(databaseConnectionConfig, 'database'),
      };

  return knex({
    client: 'mysql',
    connection,
  });
};

const runSqlQuery = async query => {
  const database = getDatabaseConnection();
  await database.raw(query);
  await database.destroy();
};

export const initializeTestDatabase = async (database, databaseName) => {
  await runSqlQuery(`CREATE DATABASE ${databaseName}`);
  await database.migrate.latest({
    directory: path.join(__dirname, '../../database-management/migrations'),
  });
  await database.seed.run({
    directory: path.join(__dirname, '../../database-management/seeds'),
  });
};

export const cleanupTestDatabase = async databaseName =>
  runSqlQuery(`DROP DATABASE ${databaseName};`);
