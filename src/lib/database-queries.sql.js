/**
 * Fetches direct meta data from corresponding database table
 * @param {any} database - The Knex object for the databse to update
 * @param {string} table - Which table to fetch from
 * @param {string} queryField - Indicates which field to query by
 * @param {string[]} queryParams - Array of parameters of type queryField to fetch
 * @param {string[]} columns - Which columns of the table to fetch
 * @returns {Promise<Object[]>}
 */
export function simpleQuery(database, table, queryField, queryParams, columns) {
  // In order to be able to identify the rows we get back we need to include the queryField
  if (!columns.includes(queryField)) {
    columns.push(queryField);
  }
  return database
    .select(...columns)
    .from(table)
    .whereIn(queryField, queryParams);
}