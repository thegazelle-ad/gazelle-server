import falcor from 'falcor';

import { database } from 'lib/db';
import { articleQuery } from './database-calls.sql';

const $ref = falcor.Model.ref;

export default [
  {
    route: "articles['bySlug'][{keys:slugs}]",
    get: async pathSet => {
      const data = await articleQuery(database, 'slug', pathSet.slugs, [
        'slug',
        'id',
      ]);
      const results = data.map(article => ({
        path: ['articles', 'bySlug', article.slug],
        value: $ref(['articles', 'byId', article.id]),
      }));
      return results;
    },
  },
];
