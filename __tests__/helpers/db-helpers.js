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

export const createTestDatabase = databaseName =>
  new Promise((resolve, reject) => {
    const connection = mysql.createConnection(
      _.omit(databaseConnectionConfig, 'database'),
    );
    connection.query(`CREATE DATABASE ${databaseName};`, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
    connection.end();
  });

export const cleanupTestDatabase = databaseName =>
  new Promise((resolve, reject) => {
    const connection = mysql.createConnection(
      _.omit(databaseConnectionConfig, 'database'),
    );
    connection.query(`DROP DATABASE ${databaseName};`, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
    connection.end();
  });
