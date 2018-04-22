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
 * Queries the tags table in the database for all tags with the given slugs selecting for
 * the given columns.
 * @param  {string[]}    slugs   the tags to select
 * @param  {string[]}    columns the columns of tags to return
 * @returns{Object[]}    rows    the result.
 */
export async function tagQuery(slugs, columns) {
  if (!_.isArray(slugs) || !_.isArray(columns)) {
    throw new Error(
      `tagQuery must be called with slugs and columns as arrays. Received slugs ${slugs} and columns ${columns}`,
    );
  }

  const processedColumns = _.uniq(columns.concat(['slug']));
  const rows = await database
    .select(...processedColumns)
    .from('tags')
    .whereIn('slug', slugs)
    .catch(e => {
      throw new Error(e);
    });
  return rows;
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
