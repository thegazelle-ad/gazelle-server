import _ from 'lodash';

import { database } from 'lib/db';

export async function searchTagsQuery(queries, min, max) {
  const results = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const query of queries) {
    // eslint-disable-next-line no-await-in-loop
    const rows = await database
      .select('slug')
      .from('tags')
      .where('name', 'like', `%${query}%`)
      .limit(max - min + 1)
      .offset(min);
    results[query] = _.map(rows, row => row.slug);
  }
  return results;
}
