import knex from 'knex';
import { getDatabaseConfig } from 'lib/utilities';

const config = getDatabaseConfig();
const knexConnectionObject = {
  client: 'mysql',
  connection: config,
};

export function dbAuthorQuery(slugs, columns) {
  // parameters are both expected to be arrays
  // the first one with author slugs to fetch
  // and the other one the columns to retrieve from the authors
  return new Promise((resolve, reject) => {
    const database = knex(knexConnectionObject);
    database.select(...columns)
    .from('authors')
    .whereIn('slug', slugs)
    .then((rows) => {
      database.destroy();
      resolve(rows);
    })
    .catch((e) => {
      reject(e);
    })
  })
}
