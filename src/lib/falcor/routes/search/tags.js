import falcor from 'falcor';
import _ from 'lodash';

import { searchTagsQuery } from './database-calls.sql';

const $ref = falcor.Model.ref;

export default [
  {
    // Search for staff member by name
    route: "search['tags'][{keys:queries}][{integers:indices}]",
    get: async pathSet => {
      let minIndex = pathSet.indices[0];
      let maxIndex = pathSet.indices[0];
      pathSet.indices.forEach(index => {
        if (index < minIndex) {
          minIndex = index;
        }
        if (index > maxIndex) {
          maxIndex = index;
        }
      });
      const data = await searchTagsQuery(pathSet.queries, minIndex, maxIndex);
      const results = _.map(data, (tagsByQuery, query) =>
        tagsByQuery.map((tagSlug, index) => ({
          // Map down indices to match the ones returned from the db call.
          path: ['search', 'tags', query, index - minIndex],
          value: $ref(['tags', 'bySlug', tagsByQuery[index - minIndex]]),
        })),
      ).flatten();
      return results;
    },
  },
];
