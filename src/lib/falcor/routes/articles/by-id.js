import falcor from 'falcor';
import _ from 'lodash';

import {
  articleIssueQuery,
  articleAuthorQuery,
  interactiveArticleQuery,
  updateAuthors,
  relatedArticleQuery,
  addView,
  database,
} from 'lib/db';
import {
  updateArticleTags,
  updateArticles,
  articleQuery,
  articleTagQuery,
} from './database-calls.sql';
import { has } from 'lib/utilities';
import { parseFalcorPseudoArray } from 'lib/falcor/falcor-utilities';
import { serverModel } from 'index';

const $ref = falcor.Model.ref;

export default [
  {
    // Get custom article data from MariaDB
    route:
      "articles['byId'][{keys:ids}]['id', 'image_url', 'slug', 'title', 'markdown', 'html', 'teaser', 'published_at', 'views', 'is_interactive']",
    get: async pathSet => {
      const requestedFields = pathSet[3];
      const data = await articleQuery(
        database,
        'id',
        pathSet.ids,
        requestedFields,
      );
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
      const flag = await updateArticles(database, 'id', articles);
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
    route: "articles['byId'][{keys:ids}]['category']",
    get: async pathSet => {
      const data = await articleQuery(database, 'id', pathSet.ids, [
        'category_id',
      ]);
      const results = data
        .map(
          article =>
            article.category_id
              ? {
                  path: ['articles', 'byId', article.id, 'category'],
                  value: $ref(['categories', 'byId', article.category_id]),
                }
              : null,
        )
        .filter(x => x !== null);
      return results;
    },
    set: async jsonGraphArg => {
      const flag = await updateArticles(
        database,
        'id',
        jsonGraphArg.articles.byId,
      );
      if (flag) {
        // Successfully updated
        return _.map(jsonGraphArg.articles.byId, (updateObject, id) => ({
          path: ['articles', 'byId', id, 'category'],
          value: $ref(['categories', 'byId', updateObject.category]),
        }));
      }
      return [];
    },
  },
  {
    // Get issueNumber from database
    route: "articles['byId'][{keys:ids}]['issueNumber']",
    get: async pathSet => {
      const data = await articleIssueQuery(pathSet.ids);
      const results = data.map(row => ({
        path: ['articles', 'byId', row.articleId, 'issueNumber'],
        value: row.issueNumber,
      }));
      return results;
    },
  },
  {
    // Get author information from article
    route: "articles['byId'][{keys:ids}]['authors'][{integers:indices}]",
    get: async pathSet => {
      const data = await articleAuthorQuery('id', pathSet.ids);
      // We receive the data as an object with keys equalling article slugs
      // and values being an array of author slugs in no particular order
      const results = [];
      _.forEach(data, (authorsSlugArray, articleId) => {
        pathSet.indices.forEach(index => {
          if (index < authorsSlugArray.length) {
            results.push({
              path: ['articles', 'byId', articleId, 'authors', index],
              value: $ref(['staff', 'bySlug', authorsSlugArray[index]]),
            });
          }
        });
      });
      return results;
    },
  },
  {
    route:
      "articles['byId'][{keys:ids}]['interactiveData']['html', 'js', 'css']",
    // Get interactive article meta data
    get: pathSet =>
      new Promise(resolve => {
        const fields = pathSet[4];
        interactiveArticleQuery(pathSet.ids, fields).then(data => {
          const results = [];
          data.forEach(article => {
            fields.forEach(field => {
              results.push({
                path: [
                  'articles',
                  'byId',
                  article.id,
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
    // Add authors to an article
    route: "articles['byId'][{keys:ids}]['authors']['updateAuthors']",
    call: (callPath, args) => {
      // the falcor.model.call only takes a path not a pathset
      // so it is not possible to call this function for more
      // than 1 article at a time, therefore we know keys:slugs is length 1
      if (callPath.ids.length > 1) {
        throw new Error(
          'updateAuthors falcor function was called illegally with more than 1 article slug',
        );
      }
      return new Promise(resolve => {
        const articleId = args[0];
        if (callPath.ids[0].toString() !== articleId) {
          throw new Error('Inconsistent article ids');
        }
        const newAuthors = args[1];
        updateAuthors(articleId, newAuthors).then(data => {
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
          resolve(results);
        });
      });
    },
  },
  {
    // Add tags to an article
    route: "articles['byId'][{keys:ids}]['tags']['updateTags']",
    call: async (callPath, args) => {
      // the falcor.model.call only takes a path not a pathset
      // so it is not possible to call this function for more
      // than 1 article at a time, therefore we know keys:ids is length 1
      if (callPath.ids.length > 1) {
        throw new Error(
          'updateTags falcor function was called illegally with more than 1 article slug',
        );
      }

      const articleId = args[0];
      if (callPath.ids[0].toString() !== articleId) {
        throw new Error('Inconsistent article ids');
      }
      const tags = args[1];

      const newTags = tags.filter(tagObject => tagObject.id === null);
      const createPromises = newTags.map(tagObject => {
        const filteredTagObject = _.omit(tagObject, 'id');
        return serverModel.call(
          ['tags', 'bySlug', 'addTag'],
          [filteredTagObject],
        );
      });
      await Promise.all(createPromises);
      const idData = await Promise.all(
        newTags.map(tagObject =>
          serverModel.get(['tags', 'bySlug', [tagObject.slug], 'id']),
        ),
      );
      const slugs = newTags.map(tagObject => tagObject.slug);
      const idsBySlugs = idData.reduce(
        (acc, cur) => Object.assign(acc, cur.json.tags.bySlug),
        {},
      );
      const ids = slugs
        .map(slug => parseFalcorPseudoArray(idsBySlugs[slug]))
        .flatten();

      let updateTags = tags
        .filter(tagObject => tagObject.id !== null)
        .map(tagObject => tagObject.id);
      if (ids.length > 0) {
        updateTags = updateTags.concat(ids);
      }

      const data = await updateArticleTags(database, articleId, updateTags);
      const results = [];
      // Invalidate all the old data
      results.push({
        path: ['articles', 'byId', articleId, 'tags'],
        invalidated: true,
      });
      data.forEach((slug, index) => {
        results.push({
          path: ['articles', 'byId', articleId, 'tags', index],
          value: $ref(['tags', 'bySlug', slug]),
        });
      });

      return results;
    },
  },
  {
    // Get related articles
    route: "articles['byId'][{keys:ids}]['related'][{integers:indices}]",
    get: pathSet =>
      new Promise(resolve => {
        // The dbRelatedArticleQuery function will only return 3 related articles
        // per article queried right now (as you shouldn't need more),
        // so you cannot request an index higher than 2
        relatedArticleQuery(pathSet.ids).then(data => {
          const results = [];
          pathSet.ids.forEach(id => {
            pathSet.indices.forEach(index => {
              if (has.call(data, id) && index < data[id].length) {
                results.push({
                  path: ['articles', 'byId', id, 'related', index],
                  value: $ref(['articles', 'byId', data[id][index]]),
                });
              }
            });
          });
          resolve(results);
        });
      }),
  },
  {
    route: "articles['byId'][{keys:ids}]['addView']",
    call: callPath =>
      new Promise(resolve => {
        // It's a function call so there should only be one slug
        if (callPath.ids.length !== 1) {
          throw new Error(
            `addView route was called with ${
              callPath.id.length
            } ids, there should only be 1`,
          );
        }
        const id = callPath.ids[0];
        addView(id).then(views => {
          resolve([
            {
              path: ['articles', 'byId', id, 'views'],
              value: views,
            },
          ]);
        });
      }),
  },
  {
    // Get tag information from article
    route: "articles['byId'][{keys:ids}]['tags'][{integers:indices}]",
    get: async pathSet => {
      const data = await articleTagQuery(database, pathSet.ids);
      return _.map(data, (tagsByArticle, articleId) =>
        tagsByArticle.map((tagSlug, index) => ({
          path: ['articles', 'byId', articleId, 'tags', index],
          value: $ref(['tags', 'bySlug', tagSlug]),
        })),
      ).flatten();
    },
  },
];
