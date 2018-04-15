import falcor from 'falcor';
import _ from 'lodash';

import {
  articleQuery,
  updateArticles,
  articleIssueQuery,
  articleAuthorQuery,
  updateAuthors,
} from 'lib/db';
import { has } from 'lib/utilities';

const $ref = falcor.Model.ref;

export default [
  {
    // Get custom article data from MariaDB
    route:
      "articles['byId'][{keys:ids}]['id', 'image_url', 'slug', 'title', 'markdown', 'html', 'teaser', 'category', 'published_at', 'views', 'is_interactive']", // eslint-disable-line max-len
    get: async pathSet => {
      const requestedFields = pathSet[3];
      const data = await articleQuery('id', pathSet.ids, requestedFields);
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
            path: ['articles', 'byId', processedArticle.id, field],
            value: processedArticle[field],
          }));
        })
        .flatten();
      return results;
    },
    set: async jsonGraphArg => {
      const articles = jsonGraphArg.articles.byId;
      const flag = await updateArticles('id', articles);
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
      );
      return results.flatten();
    },
  },
  {
    // Get author information from article
    route: "articles['byId'][{keys:ids}]['authors'][{integers:indices}]",
    get: async pathSet => {
      const data = await articleAuthorQuery('id', pathSet.ids);
      // We receive the data as an object with keys equalling article ids
      // and values being an array of author ids in no particular order
      const results = [];
      _.forEach(data, (authorsSlugArray, postId) => {
        pathSet.indices.forEach(index => {
          if (index < authorsSlugArray.length) {
            results.push({
              path: ['articles', 'byId', postId, 'authors', index],
              value: $ref(['staff', 'bySlug', authorsSlugArray[index]]),
            });
          }
        });
      });
      return results;
    },
  },
  {
    // Add authors to an article
    route: "articles['byId'][{keys:ids}]['authors']['updateAuthors']",
    call: async (callPath, args) => {
      // the falcor.model.call only takes a path not a pathset
      // so it is not possible to call this function for more
      // than 1 article at a time, therefore we know keys:ids is length 1
      if (callPath.ids.length > 1) {
        throw new Error(
          'updateAuthors falcor function was called illegally with more than 1 article id',
        );
      }
      const articleId = args[0];
      const newAuthors = args[1];
      const data = await updateAuthors(articleId, newAuthors);
      const results = [];
      // Invalidate all the old data
      results.push({
        path: ['articles', 'byId', articleId, 'authors'],
        invalidated: true,
      });
      data.forEach((slug, index) => {
        results.push({
          path: ['articles', 'byId', articleId, 'authors', index],
          value: $ref(['staff', 'bySlug', slug]),
        });
      });
      return results;
    },
  },
  {
    // Get issueNumber from database
    route: "articles['byId'][{keys:ids}]['issueNumber']",
    get: pathSet =>
      new Promise(resolve => {
        articleIssueQuery('id', pathSet.ids).then(data => {
          const results = [];
          data.forEach(row => {
            results.push({
              path: ['articles', 'byId', row.id, 'issueNumber'],
              value: row.issueNumber,
            });
          });
          resolve(results);
        });
      }),
    set: jsonGraphArg =>
      new Promise(resolve => {
        const articles = jsonGraphArg.articles.byId;
        const ids = Object.keys(articles);
        const results = [];
        ids.forEach(id => {
          results.push({
            path: ['articles', 'byId', id, 'issueNumber'],
            value: articles[id].issueNumber,
          });
        });
        resolve(results);
      }),
  },
];
