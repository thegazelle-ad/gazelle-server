// We use requireActual here in case the test calling it has mocked any
// of these modules
const path = require.requireActual('path');
const fs = require.requireActual('fs');
const JSON5 = require.requireActual('json5');
const knex = require.requireActual('knex');
const mysql = require.requireActual('mysql');
const _ = require.requireActual('lodash');

const databaseConnectionJSON5String = fs.readFileSync(
  path.join(__dirname, '../../config/database.config.json5'),
);

const databaseConnectionConfig = JSON5.parse(databaseConnectionJSON5String);

export const getDatabaseConnection = databaseName =>
  knex({
    client: 'mysql',
    connection: {
      ...databaseConnectionConfig,
      database: databaseName,
    },
  });

const endConnection = connection =>
  new Promise((resolve, reject) => {
    connection.end(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

const runSqlQuery = query =>
  new Promise((resolve, reject) => {
    const connection = mysql.createConnection(
      _.omit(databaseConnectionConfig, 'database'),
    );
    connection.connect(connectionErr => {
      if (connectionErr) {
        reject(connectionErr);
        endConnection(connection);
        return;
      }

      connection.query(query, err => {
        if (err) {
          reject(err);
          endConnection(connection);
          return;
        }
        resolve(endConnection(connection));
      });
    });
  });

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
