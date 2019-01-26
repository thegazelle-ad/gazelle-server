import falcor from 'falcor';

import { simpleQuery } from 'lib/db';

const $ref = falcor.Model.ref;

export const routes = [
  {
    route: "staff['byId'][{keys:ids}]",
    get: async pathSet => {
      const data = await simpleQuery('staff', 'id', pathSet.ids, [
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
