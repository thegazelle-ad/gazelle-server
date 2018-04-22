import falcor from 'falcor';

import { database } from 'lib/db';
import { categoryQuery } from './database-calls';

const $ref = falcor.Model.ref;

export const routes = [
  {
    route: "categories['byId'][{keys:ids}]",
    get: async pathSet => {
      const data = await categoryQuery(database, 'id', pathSet.ids, [
        'slug',
        'id',
      ]);
      const results = data.map(category => ({
        path: ['categories', 'byId', category.id],
        value: $ref(['categories', 'bySlug', category.slug]),
      }));
      return results;
    },
  },
];
