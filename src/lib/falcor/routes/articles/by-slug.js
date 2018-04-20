import falcor from 'falcor';
import _ from 'lodash';

import {
  articleQuery,
  updateArticles,
  articleIssueQuery,
  articleAuthorQuery,
  interactiveArticleQuery,
  updateAuthors,
  relatedArticleQuery,
  addView,
} from 'lib/db';
import { has } from 'lib/utilities';

const $ref = falcor.Model.ref;

export default [
  {
    // Get custom article data from MariaDB
    route:
      "articles['bySlug'][{keys:slugs}]['id', 'image_url', 'slug', 'title', 'markdown', 'html', 'teaser', 'category', 'published_at', 'views', 'is_interactive']", // eslint-disable-line max-len
    get: async pathSet => {
      const requestedFields = pathSet[3];
      const data = await articleQuery('slug', pathSet.slugs, requestedFields);
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
            path: ['articles', 'bySlug', processedArticle.slug, field],
            value: processedArticle[field],
          }));
        })
        .flatten();
      return results;
    },
    set: async jsonGraphArg => {
      const articles = jsonGraphArg.articles.bySlug;
      const flag = await updateArticles('slug', articles);
      if (!flag) {
        throw new Error(
          'For unknown reasons updatePostMeta returned a non-true flag',
        );
      }
      const results = _.map(articles, (singleArticle, slug) =>
        _.map(singleArticle, (value, field) => ({
          path: ['articles', 'bySlug', slug, field],
          value,
        })),
      );
      // If any Article slugs have been changed, invalidate refs
      if (
        _.some(
          articles,
          (singleArticle, originalSlug) => singleArticle.slug !== originalSlug,
        )
      ) {
        results.push({ path: ['articles', 'byId'], invalidated: true });
        results.push({ path: ['articles', 'byPage'], invalidated: true });
      }
      return results.flatten();
    },
  },
  {
    // Get issueNumber from database
    route: "articles['bySlug'][{keys:slugs}]['issueNumber']",
    get: pathSet =>
      new Promise(resolve => {
        articleIssueQuery(pathSet.slugs).then(data => {
          const results = [];
          data.forEach(row => {
            results.push({
              path: ['articles', 'bySlug', row.slug, 'issueNumber'],
              value: row.issueNumber,
            });
          });
          resolve(results);
        });
      }),
    set: jsonGraphArg =>
      new Promise(resolve => {
        const articles = jsonGraphArg.articles.bySlug;
        const slugs = Object.keys(articles);
        const results = [];
        slugs.forEach(slug => {
          results.push({
            path: ['articles', 'bySlug', slug, 'issueNumber'],
            value: articles[slug].issueNumber,
          });
        });
        resolve(results);
      }),
  },
  {
    // Get author information from article
    route: "articles['bySlug'][{keys:slugs}]['staff'][{integers:indices}]",
    get: pathSet =>
      new Promise(resolve => {
        articleAuthorQuery('slug', pathSet.slugs).then(data => {
          // We receive the data as an object with keys equalling article slugs
          // and values being an array of author slugs in no particular order
          const results = [];
          _.forEach(data, (staffSlugArray, postSlug) => {
            pathSet.indices.forEach(index => {
              if (index < staffSlugArray.length) {
                results.push({
                  path: ['articles', 'bySlug', postSlug, 'staff', index],
                  value: $ref(['staff', 'bySlug', staffSlugArray[index]]),
                });
              }
            });
          });
          resolve(results);
        });
      }),
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
    // Add staff to an article
    route: "articles['bySlug'][{keys:slugs}]['staff']['updateStaff']",
    call: (callPath, args) => {
      // the falcor.model.call only takes a path not a pathset
      // so it is not possible to call this function for more
      // than 1 article at a time, therefore we know keys:slugs is length 1
      if (callPath.slugs > 1) {
        throw new Error(
          'updateAuthors falcor function was called illegally with more than 1 article slug',
        );
      }
      return new Promise(resolve => {
        const articleId = args[0];
        const newStaff = args[1];
        const articleSlug = callPath.slugs[0];
        updateAuthors(articleId, newStaff).then(data => {
          const results = [];
          // Invalidate all the old data
          results.push({
            path: ['articles', 'bySlug', articleSlug, 'staff'],
            invalidated: true,
          });
          data.forEach((slug, index) => {
            results.push({
              path: ['articles', 'bySlug', articleSlug, 'staff', index],
              value: $ref(['staff', 'bySlug', slug]),
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
