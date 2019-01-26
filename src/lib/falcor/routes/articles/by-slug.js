import falcor from 'falcor';

import { simpleQuery } from 'lib/db';

const $ref = falcor.Model.ref;

export default [
  {
    route: "articles['bySlug'][{keys:slugs}]",
    get: async pathSet => {
      const data = await simpleQuery('articles', 'slug', pathSet.slugs, [
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
