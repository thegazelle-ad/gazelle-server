import falcor from 'falcor';

import { database } from 'lib/db';
import { simpleQuery } from 'lib/database-queries.sql';

const $ref = falcor.Model.ref;

export const routes = [
  {
    route: "staff['byId'][{keys:ids}]",
    get: async pathSet => {
      const data = await simpleQuery(database, 'staff', 'id', pathSet.ids, [
        'slug',
        'id',
      ]);
      const results = data.map(article => ({
        path: ['staff', 'byId', article.id],
        value: $ref(['staff', 'bySlug', article.slug]),
      }));
      return results;
    },
  },
];
