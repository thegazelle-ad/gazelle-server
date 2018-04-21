import falcor from 'falcor';

import { articleQuery } from 'lib/db';

const $ref = falcor.Model.ref;

export default [
  {
    /* 
     * Get custom article slug from MariaDB and create ref
     * It should be noted that this is the Falcor correct way
     * to have multiple routes to access the same data, however
     * it is inefficient from a SQL perspective since multiple
     * SQL queries are used to access the same data when we are
     * querying by ID. 
     */
    route: "articles['byId'][{keys:ids}]", // eslint-disable-line max-len
    get: async pathSet => {
      const data = await articleQuery('id', pathSet.ids, ['slug', 'id']);
      const results = data.map(article => ({
        path: ['articles', 'byId', article.id],
        value: $ref(['articles', 'bySlug', article.slug]),
      }));
      return results;
    },
  },
];
