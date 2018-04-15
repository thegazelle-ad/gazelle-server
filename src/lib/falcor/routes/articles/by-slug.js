import falcor from 'falcor';

import {
  articleQuery,
  interactiveArticleQuery,
  relatedArticleQuery,
  addView,
} from 'lib/db';
import { has } from 'lib/utilities';

const $ref = falcor.Model.ref;

export default [
  {
    /* 
     * Get custom article id from MariaDB and create ref
     * to that article bySlug. To avoid multiple SQL queries,
     * when unneccesary, this file holds all calls that are
     * exclusively used by the Main page
     */
    route: "articles['bySlug'][{keys:slugs}]", // eslint-disable-line max-len
    get: async pathSet => {
      const data = await articleQuery('slug', pathSet.slugs, ['slug', 'id']);
      const results = data.map(article => ({
        path: ['articles', 'bySlug', article.slug],
        value: $ref(['articles', 'byId', article.id]),
      }));
      return results;
    },
  },
  {
    route:
      "articles['bySlug'][{keys:slugs}]['interactiveData']['html', 'js', 'css']",
    // Get interactive article meta data
    get: pathSet =>
      new Promise(resolve => {
        const fields = pathSet[4];
        interactiveArticleQuery(pathSet.slugs, fields).then(data => {
          const results = [];
          data.forEach(article => {
            fields.forEach(field => {
              results.push({
                path: [
                  'articles',
                  'bySlug',
                  article.slug,
                  'interactiveData',
                  field,
                ],
                value: article[field],
              });
            });
          });
          resolve(results);
        });
      }),
  },
  {
    // Get related articles
    route: "articles['bySlug'][{keys:slugs}]['related'][{integers:indices}]",
    get: pathSet =>
      new Promise(resolve => {
        // The dbRelatedArticleQuery function will only return 3 related articles
        // per article queried right now (as you shouldn't need more),
        // so you cannot request an index higher than 2
        relatedArticleQuery(pathSet.slugs).then(data => {
          const results = [];
          pathSet.slugs.forEach(slug => {
            pathSet.indices.forEach(index => {
              if (has.call(data, slug) && index < data[slug].length) {
                results.push({
                  path: ['articles', 'bySlug', slug, 'related', index],
                  value: $ref(['articles', 'bySlug', data[slug][index]]),
                });
              }
            });
          });
          resolve(results);
        });
      }),
  },
  {
    route: "articles['bySlug'][{keys:slugs}]['addView']",
    call: callPath =>
      new Promise(resolve => {
        // It's a function call so there should only be one slug
        if (callPath.slugs.length !== 1) {
          throw new Error(
            `addView route was called with ${
              callPath.slugs.length
            } slugs, there should only be 1`,
          );
        }
        const slug = callPath.slugs[0];
        addView(slug).then(views => {
          if (views === false) {
            // Means the article wasn't found
            resolve([]);
          } else if (!views || typeof views !== 'number') {
            throw new Error(
              `addView for slug ${slug} returned unexpected value`,
            );
          } else {
            resolve([
              {
                path: ['articles', 'bySlug', slug, 'views'],
                value: views,
              },
            ]);
          }
        });
      }),
  },
];
