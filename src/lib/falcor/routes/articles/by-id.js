import falcor from 'falcor';
import _ from 'lodash';

import {
  articleIdQuery,
  articleAuthorIdQuery,
  updateArticles,
  updateAuthors,
} from 'lib/db';

import { cleanupJsonGraphArg } from 'lib/falcor/falcor-utilities';
import { has } from 'lib/utilities';

const $ref = falcor.Model.ref;

export default [
  {
    // Get custom article data from MariaDB
    route: "articles['byId'][{keys:ids}]", // eslint-disable-line max-len
    get: async pathSet => {
      const requestedFields = pathSet[3];
      const data = await articleIdQuery(pathSet.ids, requestedFields);
      const results = data
        .map(article => {
          const processedArticle = { ...article };
          if (
            has.call(processedArticle, 'published_at') &&
            processedArticle.published_at instanceof Date
          ) {
            processedArticle.published_at = processedArticle.published_at.getTime();
          }
          return requestedFields.map(field => ({
            path: ['articles', 'byId', processedArticle.id],
            value: processedArticle[field],
          }));
        })
        .flatten();
      return results;
    },
    set: async jsonGraphArg => {
      jsonGraphArg = cleanupJsonGraphArg(jsonGraphArg); // eslint-disable-line no-param-reassign
      const articles = jsonGraphArg.articles.byId;
      const articlesToUpdate = _.mapKeys(articles, value => value.slug);
      const flag = await updateArticles(articlesToUpdate);
      if (!flag) {
        throw new Error(
          'For unknown reasons updatePostMeta returned a non-true flag',
        );
      }
      const results = _.map(articles, (singleArticle, id) =>
        _.map(singleArticle, (value, field) => ({
          path: ['articles', 'byId', id, field],
          value,
        })),
      ).flatten();
      return results;
    },
  },
  {
    // Get author information from article
    route: "articles['byId'][{keys:ids}]['authors'][{integers:indices}]",
    get: pathSet =>
      new Promise(resolve => {
        articleAuthorIdQuery(pathSet.ids).then(data => {
          // We receive the data as an object with keys equalling article ids
          // and values being an array of author ids in no particular order
          const results = [];
          _.forEach(data, (authorSlugArray, postId) => {
            pathSet.indices.forEach(index => {
              if (index < authorSlugArray.length) {
                results.push({
                  path: ['articles', 'byId', postId, 'authors', index],
                  value: $ref(['staff', 'bySlug', authorSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      }),
  },
  {
    // Add authors to an article
    route: "articles['byId'][{keys:ids}]['authors']['updateAuthors']",
    call: (callPath, args) => {
      // the falcor.model.call only takes a path not a pathset
      // so it is not possible to call this function for more
      // than 1 article at a time, therefore we know keys:ids is length 1
      if (callPath.ids.length > 1) {
        throw new Error(
          'updateAuthors falcor function was called illegally with more than 1 article id',
        );
      }
      return new Promise(resolve => {
        const articleId = args[0];
        const newAuthors = args[1];
        updateAuthors(articleId, newAuthors).then(data => {
          const results = [];
          // Invalidate all the old data
          results.push({
            path: ['articles', 'byId', articleId, 'staff'],
            invalidated: true,
          });
          data.forEach((slug, index) => {
            results.push({
              path: ['articles', 'byId', articleId, 'staff', index],
              value: $ref(['staff', 'bySlug', slug]),
            });
          });
          resolve(results);
        });
      });
    },
  },
];
