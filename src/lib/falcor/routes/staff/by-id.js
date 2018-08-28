import falcor from 'falcor';

import { database } from 'lib/db';
import { staffQuery } from './database-calls.sql';

const $ref = falcor.Model.ref;

export const routes = [
  {
    route: "staff['byId'][{keys:ids}]",
    get: async pathSet => {
      const data = await staffQuery(database, 'id', pathSet.ids, [
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
