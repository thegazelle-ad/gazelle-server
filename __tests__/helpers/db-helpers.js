// Be careful not to mock any of these in your test!
import path from 'path';
import knex from 'knex';
import _ from 'lodash';
import * as dotenv from 'dotenv';

const envVars = dotenv.config().parsed;

const databaseConnectionConfig = {
  user: envVars.DATABASE_USER,
  host: envVars.DATABASE_HOST,
  database: envVars.DATABASE_NAME,
  password: envVars.DATABASE_PASSWORD,
};

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
