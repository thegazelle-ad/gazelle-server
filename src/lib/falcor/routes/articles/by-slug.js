import falcor from 'falcor';
import _ from 'lodash';

import * as db from 'lib/db';
import { mapGhostNames, cleanupJsonGraphArg } from 'lib/falcor/falcor-utilities';
import { ghostArticleQuery } from 'lib/ghost-api';

const $ref = falcor.Model.ref;

export default [
  {
    // Get article data from Ghost API
    route: "articles['bySlug'][{keys:slugs}]['id', 'image', 'slug', 'title', 'markdown', 'html', 'teaser']", // eslint-disable-line max-len
    get: (pathSet) => (
      new Promise((resolve) => {
        const requestedFields = pathSet[3];
        let query = 'filter=';
        pathSet.slugs.forEach((slug, index) => {
          query += `${index > 0 ? ',' : ''}slug:'${slug}'`;
        });
        query += '&fields=slug';
        requestedFields.forEach((field) => {
          if (field !== 'slug') {
            query += `,${mapGhostNames(field)}`;
          }
        });
        query += `&limit=${pathSet.slugs.length}`;
        ghostArticleQuery(query).then((data) => {
          const posts = data.posts;
          const results = [];
          posts.forEach((article) => {
            requestedFields.forEach((field) => {
              const ghostField = mapGhostNames(field);
              results.push({
                path: ['articles', 'bySlug', article.slug, field],
                value: article[ghostField],
              });
            });
          });
          resolve(results);
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error('Error was found in Ghost query for slugs:');
          console.error(pathSet.slugs); // eslint-disable-line no-console
          console.error(e); // eslint-disable-line no-console
          resolve([]);
        });
      })
    ),
    set: (jsonGraphArg) => (
      new Promise((resolve) => {
        jsonGraphArg = cleanupJsonGraphArg(jsonGraphArg); // eslint-disable-line no-param-reassign
        const articles = jsonGraphArg.articles.bySlug;
        const slugs = Object.keys(articles);
        db.updateGhostFields(articles).then((flag) => {
          const results = [];
          if (flag !== true) {
            throw new Error('For unknown reasons updateGhostFields returned a non-true flag');
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
    // Get custom article data from MariaDB
    route: "articles['bySlug'][{keys:slugs}]['category', 'published_at', 'views', 'is_interactive']", // eslint-disable-line max-len
    get: (pathSet) => (
      new Promise((resolve) => {
        const requestedFields = pathSet[3];
        db.articleQuery(pathSet.slugs, requestedFields).then((data) => {
          const results = [];
          data.forEach((article) => {
            const processedArticle = { ...article };
            if (
              processedArticle.hasOwnProperty('published_at') &&
              processedArticle.published_at instanceof Date
            ) {
              processedArticle.published_at = processedArticle.published_at.getTime();
            }
            requestedFields.forEach((field) => {
              results.push({
                path: ['articles', 'bySlug', processedArticle.slug, field],
                value: processedArticle[field],
              });
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
        db.updatePostMeta(articles)
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
        db.articleIssueQuery(pathSet.slugs).then((data) => {
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
        db.articleAuthorQuery(pathSet.slugs).then((data) => {
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
        db.interactiveArticleQuery(pathSet.slugs, fields).then((data) => {
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
        db.updateAuthors(articleId, newAuthors).then((data) => {
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
        db.relatedArticleQuery(pathSet.slugs).then((data) => {
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
        db.addView(slug).then((views) => {
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
