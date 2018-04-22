import falcor from 'falcor';
import _ from 'lodash';

import { articleQuery, database } from 'lib/db';
import { articleTagQuery } from './database-calls';

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
  {
    // Get tag information from article
    route: "articles['byId'][{keys:ids}]['tags'][{integers:indices}]",
    get: async pathSet => {
      const data = await articleTagQuery(database, pathSet.ids);
      return _.map(data, (tagsByArticle, articleSlug) =>
        tagsByArticle.map((tagSlug, index) => ({
          path: ['articles', 'bySlug', articleSlug, 'tags', index],
          value: $ref(['tags', 'bySlug', tagSlug]),
        })),
      ).flatten();
    },
  },
];
