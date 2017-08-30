import falcor from 'falcor';
import _ from 'lodash';

import DbFunctions from 'lib/db';

const db = new DbFunctions;
const $ref = falcor.Model.ref;

export default [
  {
    // get categories name
    route: "categories['bySlug'][{keys:slugs}]['name', 'slug']",
    get: (pathSet) => (
      new Promise((resolve) => {
        const requestedFields = pathSet[3];
        db.categoryQuery(pathSet.slugs, requestedFields).then((data) => {
          const results = [];
          data.forEach((category) => {
            requestedFields.forEach((field) => {
              results.push({
                path: ['categories', 'bySlug', category.slug, field],
                value: category[field],
              });
            });
          });
          resolve(results);
        });
      })
    ),
  },
  {
    // get articles in a category
    route: "categories['bySlug'][{keys:slugs}]['articles'][{integers:indices}]",
    get: (pathSet) => (
      new Promise((resolve) => {
        db.categoryArticleQuery(pathSet.slugs).then((data) => {
          // We receive the data as an object with keys equalling category slugs
          // and values being an array of article slugs where the most recent is first
          const results = [];
          _.forEach(data, (postSlugArray, categorySlug) => {
            pathSet.indices.forEach((index) => {
              if (index < postSlugArray.length) {
                results.push({
                  path: ['categories', 'bySlug', categorySlug, 'articles', index],
                  value: $ref(['articles', 'bySlug', postSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      })
    ),
  },
];
