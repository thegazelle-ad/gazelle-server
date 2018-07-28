import falcor from 'falcor';
import _ from 'lodash';

import { database } from 'lib/db';
import { categoryQuery, categoryArticleQuery } from './database-calls.sql';

const $ref = falcor.Model.ref;

export const routes = [
  {
    // get categories name
    route: "categories['byId'][{keys:ids}]['id', 'name', 'slug']",
    get: async pathSet => {
      const requestedFields = pathSet[3];
      const data = await categoryQuery(
        database,
        'id',
        pathSet.ids,
        requestedFields,
      );
      const results = data
        .map(category =>
          requestedFields.map(field => ({
            path: ['categories', 'byId', category.id, field],
            value: category[field],
          })),
        )
        .flatten();
      return results;
    },
  },
  {
    // get articles in a category
    route: "categories['byId'][{keys:ids}]['articles'][{integers:indices}]",
    get: async pathSet => {
      const data = await categoryArticleQuery(database, pathSet.ids);
      // We receive the data as an object with keys equalling category slugs
      // and values being an array of article slugs where the most recent is first
      const results = _.map(data, (articlesIdArray, categoryId) =>
        pathSet.indices
          .map(index => {
            if (index < articlesIdArray.length) {
              return {
                path: ['categories', 'byId', categoryId, 'articles', index],
                value: $ref(['articles', 'byId', articlesIdArray[index]]),
              };
            }
            return null;
          })
          .filter(x => x !== null),
      ).flatten();
      return results;
    },
  },
];
