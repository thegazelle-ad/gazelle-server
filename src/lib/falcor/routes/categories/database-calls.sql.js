import { has } from 'lib/utilities';

/**
 * Fetches direct meta data of categories from the categories database table
 * @param {any} database - The Knex object for the databse to update
 * @param {string} queryField - Indicates which field to query by
 * @param {string[]} queryParams - Array of parameters of type queryField of categories to fetch
 * @param {string[]} columns - Which columns of the articles table to fetch
 * @returns {Promise<Object[]>}
 */
export function categoryQuery(database, queryField, queryParams, columns) {
  // In order to be able to identify the rows we get back we need to include the queryField
  if (!columns.includes(queryField)) {
    columns.push(queryField);
  }
  return database
    .select(...columns)
    .from('categories')
    .whereIn(queryField, queryParams);
}

export async function categoryArticleQuery(database, ids) {
  const rows = await database
    .select('id as articleId', 'category_id as categoryId')
    .from('articles')
    .whereIn('category_id', ids)
    .whereNotNull('published_at')
    .orderBy('published_at', 'desc');

  const data = {};
  // We build the data
  rows.forEach(row => {
    // This will input them in chronological order as the query was structured as so.
    if (!has.call(data, row.categoryId)) {
      data[row.categoryId] = [row.articleId];
    } else {
      data[row.categoryId].push(row.articleId);
    }
  });
  return data;
}
