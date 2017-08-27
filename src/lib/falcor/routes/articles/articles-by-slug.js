import falcor from 'falcor';
import _ from 'lodash';

import DbFunctions from 'lib/db';
import { mapGhostNames } from 'lib/falcor/falcor-utilities';
import { ghostArticleQuery } from 'lib/ghost-api';

const db = new DbFunctions;
const $ref = falcor.Model.ref;

export default [
  {
    // Get article data from Ghost API
    route: "articlesBySlug[{keys:slugs}]['id', 'image', 'slug', 'title', 'markdown', 'html', 'teaser']", // eslint-disable-line max-len
    get: (pathSet) => (
      new Promise((resolve) => {
        const requestedFields = pathSet[2];
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
        query += `&limit=${pathSet.slugs.length.toString()}`;
        ghostArticleQuery(query).then((data) => {
          let dataInstance = data;
          dataInstance = data.posts;
          const results = [];
          dataInstance.forEach((article) => {
            requestedFields.forEach((field) => {
              const ghostField = mapGhostNames(field);
              results.push({
                path: ['articlesBySlug', article.slug, field],
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
        const articlesBySlug = jsonGraphArg.articlesBySlug;
        const slugs = Object.keys(articlesBySlug);
        db.updateGhostFields(articlesBySlug).then((flag) => {
          const results = [];
          if (flag !== true) {
            throw new Error('For unknown reasons updateGhostFields returned a non-true flag');
          }
          slugs.forEach((slug) => {
            const slugObject = articlesBySlug[slug];
            _.forEach(slugObject, (value, field) => {
              results.push({
                path: ['articlesBySlug', slug, field],
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
    route: "articlesBySlug[{keys:slugs}]['category', 'published_at', 'views']",
    get: (pathSet) => (
      new Promise((resolve) => {
        const requestedFields = pathSet[2];
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
                path: ['articlesBySlug', processedArticle.slug, field],
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
        const articlesBySlug = jsonGraphArg.articlesBySlug;
        const slugs = Object.keys(articlesBySlug);
        const results = [];
        db.updatePostMeta(articlesBySlug)
        .then((flag) => {
          if (!flag) {
            throw new Error('For unknown reasons updatePostMeta returned a non-true flag');
          }
          slugs.forEach((slug) => {
            const slugObject = articlesBySlug[slug];
            _.forEach(slugObject, (value, field) => {
              results.push({
                path: ['articlesBySlug', slug, field],
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
    route: "articlesBySlug[{keys:slugs}]['issueNumber']",
    get: (pathSet) => (
      new Promise((resolve) => {
        db.articleIssueQuery(pathSet.slugs).then((data) => {
          const results = [];
          data.forEach((row) => {
            results.push({
              path: ['articlesBySlug', row.slug, 'issueNumber'],
              value: row.issueNumber,
            });
          });
          resolve(results);
        });
      })
    ),
    set: (jsonGraphArg) => (
      new Promise((resolve) => {
        const articlesBySlug = jsonGraphArg.articlesBySlug;
        const slugs = Object.keys(articlesBySlug);
        const results = [];
        slugs.forEach((slug) => {
          results.push({
            path: ['articlesBySlug', slug, 'issueNumber'],
            value: articlesBySlug[slug].issueNumber,
          });
        });
        resolve(results);
      })
    ),
  },
  {
    // Get author information from article
    route: "articlesBySlug[{keys:slugs}]['authors'][{integers:indices}]",
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
                  path: ['articlesBySlug', postSlug, 'authors', index],
                  value: $ref(['authorsBySlug', authorSlugArray[index]]),
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
    // Add authors to an article
    route: "articlesBySlug[{keys:slugs}]['authors']['updateAuthors']",
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
            path: ['articlesBySlug', articleSlug, 'authors'],
            invalidated: true,
          });
          data.forEach((slug, index) => {
            results.push({
              path: ['articlesBySlug', articleSlug, 'authors', index],
              value: $ref(['authorsBySlug', slug]),
            });
          });
          resolve(results);
        });
      });
    },
  },
  {
    // Get related articles
    route: "articlesBySlug[{keys:slugs}]['related'][{integers:indices}]",
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
                  path: ['articlesBySlug', slug, 'related', index],
                  value: $ref(['articlesBySlug', data[slug][index]]),
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
    route: "articlesBySlug[{keys:slugs}]['addView']",
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
              path: ['articlesBySlug', slug, 'views'],
              value: views,
            }]);
          }
        });
      })
    ),
  },
];
