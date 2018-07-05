import _ from 'lodash';

import { database } from 'lib/db';

/**
 * @param   {Object[]}   tagObject the tag to be added.
 * @returns {boolean}    tags      number of tags modified
 */
export async function addTag(tagObject) {
  await database('tags').insert(tagObject);
  return true;
}

/**
 * Fetches direct meta data of tags from the tags database table
 * @param {string} queryField - Indicates which field to query by
 * @param {string[]} queryParams - Array of parameters of type queryField of articles to fetch
 * @param {string[]} columns - Which columns of the articles table to fetch
 * @returns {Promise<Object[]>}
 */
export function tagQuery(queryField, queryParams, columns) {
  // In order to be able to identify the rows we get back we need to include the queryField
  if (!columns.includes(queryField)) {
    columns.push(queryField);
  }
  return database
    .select(...columns)
    .from('tags')
    .whereIn(queryField, queryParams);
}

/**
 * Update tags given a json graph.
 * @param   {Object}   jsonGraphArg - the json graph to update
 */
export function updateTags(jsonGraphArg) {
  _.forEach(jsonGraphArg, async (tagObject, slug) => {
    await database('tags')
      .where('slug', '=', slug)
      .update(tagObject)
      .then(data => {
        if (data !== 1) {
          throw new Error(`Problems updating tag with slug: ${slug}`);
        }
      })
      .catch(e => {
        throw e;
      });
  });
}
