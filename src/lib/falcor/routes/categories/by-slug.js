import falcor from 'falcor';

import { simpleQuery } from 'lib/db';

const $ref = falcor.Model.ref;

export const routes = [
  {
    route: "categories['bySlug'][{keys:slugs}]",
    get: async pathSet => {
      const data = await simpleQuery('categories', 'slug', pathSet.slugs, [
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
