import falcor from 'falcor';

import { database } from 'lib/db';
import { simpleQuery } from 'lib/database-queries.sql';

const $ref = falcor.Model.ref;

export default [
  {
    route: "articles['bySlug'][{keys:slugs}]",
    get: async pathSet => {
      const data = await simpleQuery(database, 'articles', 'slug', pathSet.slugs, [
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
