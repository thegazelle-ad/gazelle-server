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
