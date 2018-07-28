import falcor from 'falcor';

import { database } from 'lib/db';
import { categoryQuery } from './database-calls.sql';

const $ref = falcor.Model.ref;

export const routes = [
  {
    route: "categories['bySlug'][{keys:slugs}]",
    get: async pathSet => {
      const data = await categoryQuery(database, 'slug', pathSet.slugs, [
        'slug',
        'id',
      ]);
      const results = data.map(category => ({
        path: ['categories', 'bySlug', category.slug],
        value: $ref(['categories', 'byId', category.id]),
      }));
      return results;
    },
  },
];
