import falcor from 'falcor';
import _ from 'lodash';

import {
  articleQuery,
  updatePostMeta,
  articleIssueQuery,
  articleAuthorQuery,
  interactiveArticleQuery,
  updateAuthors,
  relatedArticleQuery,
  addView,
} from 'lib/db';
import { cleanupJsonGraphArg } from 'lib/falcor/falcor-utilities';

const $ref = falcor.Model.ref;

export default [
  {
    // Get custom article data from MariaDB
    route: "articles['bySlug'][{keys:slugs}]['id', 'image_url', 'slug', 'title', 'markdown', 'html', 'teaser', 'category', 'published_at', 'views', 'is_interactive']", // eslint-disable-line max-len
    get: async (pathSet) => {
      const requestedFields = pathSet[3];
      const data = await articleQuery(pathSet.slugs, requestedFields);
      const results = data.map(article => {
        const processedArticle = { ...article };
        if (
          processedArticle.hasOwnProperty('published_at') &&
          processedArticle.published_at instanceof Date
        ) {
          processedArticle.published_at = processedArticle.published_at.getTime();
        }
        return requestedFields.map(field => ({
          path: ['articles', 'bySlug', processedArticle.slug, field],
          value: processedArticle[field],
        }));
      }).flatten();
      return results;
    },
    set: (jsonGraphArg) => (
      new Promise((resolve) => {
        jsonGraphArg = cleanupJsonGraphArg(jsonGraphArg); // eslint-disable-line no-param-reassign
        const articles = jsonGraphArg.articles.bySlug;
        const slugs = Object.keys(articles);
        const results = [];
        updatePostMeta(articles)
        .then((flag) => {
          if (!flag) {
            throw new Error('For unknown reasons updatePostMeta returned a non-true flag');
          }
          slugs.forEach((slug) => {
            const slugObject = articles[slug];
            _.forEach(slugObject, (value, field) => {
              results.push({
                path: ['articles', 'bySlug', slug, field],
                value,
              });
            });
          });
          resolve(results);
        });
      })
    ),
  },
  {
    // Get issueNumber from database
    route: "articles['bySlug'][{keys:slugs}]['issueNumber']",
    get: (pathSet) => (
      new Promise((resolve) => {
        articleIssueQuery(pathSet.slugs).then((data) => {
          const results = [];
          data.forEach((row) => {
            results.push({
              path: ['articles', 'bySlug', row.slug, 'issueNumber'],
              value: row.issueNumber,
            });
          });
          resolve(results);
        });
      })
    ),
    set: (jsonGraphArg) => (
      new Promise((resolve) => {
        jsonGraphArg = cleanupJsonGraphArg(jsonGraphArg); // eslint-disable-line no-param-reassign
        const articles = jsonGraphArg.articles.bySlug;
        const slugs = Object.keys(articles);
        const results = [];
        slugs.forEach((slug) => {
          results.push({
            path: ['articles', 'bySlug', slug, 'issueNumber'],
            value: articles[slug].issueNumber,
          });
        });
        resolve(results);
      })
    ),
  },
  {
    // Get author information from article
    route: "articles['bySlug'][{keys:slugs}]['authors'][{integers:indices}]",
    get: (pathSet) => (
      new Promise((resolve) => {
        articleAuthorQuery(pathSet.slugs).then((data) => {
          // We receive the data as an object with keys equalling article slugs
          // and values being an array of author slugs in no particular order
          const results = [];
          _.forEach(data, (authorSlugArray, postSlug) => {
            pathSet.indices.forEach((index) => {
              if (index < authorSlugArray.length) {
                results.push({
                  path: ['articles', 'bySlug', postSlug, 'authors', index],
                  value: $ref(['authors', 'bySlug', authorSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      })
    ),
  },
  {
    route: "articles['bySlug'][{keys:slugs}]['interactiveData']['html', 'js', 'css']",
    // Get interactive article meta data
    get: (pathSet) => (
      new Promise((resolve) => {
        const fields = pathSet[4];
        interactiveArticleQuery(pathSet.slugs, fields).then((data) => {
          const results = [];
          data.forEach((article) => {
            fields.forEach((field) => {
              results.push({
                path: ['articles', 'bySlug', article.slug, 'interactiveData', field],
                value: article[field],
              });
            });
          });
          resolve(results);
        });
      })
    ),
  },
  {
    // Add authors to an article
    route: "articles['bySlug'][{keys:slugs}]['authors']['updateAuthors']",
    call: (callPath, args) => {
      // the falcor.model.call only takes a path not a pathset
      // so it is not possible to call this function for more
      // than 1 article at a time, therefore we know keys:slugs is length 1
      if (callPath.slugs > 1) {
        throw new Error(
          'updateAuthors falcor function was called illegally with more than 1 article slug'
        );
      }
      return new Promise((resolve) => {
        const articleId = args[0];
        const newAuthors = args[1];
        const articleSlug = callPath.slugs[0];
        updateAuthors(articleId, newAuthors).then((data) => {
          const results = [];
          // Invalidate all the old data
          results.push({
            path: ['articles', 'bySlug', articleSlug, 'authors'],
            invalidated: true,
          });
          data.forEach((slug, index) => {
            results.push({
              path: ['articles', 'bySlug', articleSlug, 'authors', index],
              value: $ref(['authors', 'bySlug', slug]),
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    // Get related articles
    route: "articles['bySlug'][{keys:slugs}]['related'][{integers:indices}]",
    get: (pathSet) => (
      new Promise((resolve) => {
        // The dbRelatedArticleQuery function will only return 3 related articles
        // per article queried right now (as you shouldn't need more),
        // so you cannot request an index higher than 2
        relatedArticleQuery(pathSet.slugs).then((data) => {
          const results = [];
          pathSet.slugs.forEach((slug) => {
            pathSet.indices.forEach((index) => {
              if (data.hasOwnProperty(slug) && index < data[slug].length) {
                results.push({
                  path: ['articles', 'bySlug', slug, 'related', index],
                  value: $ref(['articles', 'bySlug', data[slug][index]]),
                });
              }
            });
          });
          resolve(results);
        });
      })
    ),
  },
  {
    route: "articles['bySlug'][{keys:slugs}]['addView']",
    call: (callPath) => (
      new Promise((resolve) => {
        // It's a function call so there should only be one slug
        if (callPath.slugs.length !== 1) {
          throw new Error(
            `addView route was called with ${callPath.slugs.length} slugs, there should only be 1`
          );
        }
        const slug = callPath.slugs[0];
        addView(slug).then((views) => {
          if (views === false) {
            // Means the article wasn't found
            resolve([]);
          } else if (!views || (typeof views) !== 'number') {
            throw new Error(`addView for slug ${slug} returned unexpected value`);
          } else {
            resolve([{
              path: ['articles', 'bySlug', slug, 'views'],
              value: views,
            }]);
          }
        });
      })
    ),
  },
];
