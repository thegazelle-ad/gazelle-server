import { getNumArticles, database } from 'lib/db';
import { logger } from 'lib/logger';
import { createNewArticle } from './database-calls.sql';
import { buildErrorMessage } from 'lib/error-helpers';
import { has } from 'lib/utilities';
import falcor from 'falcor';
import _ from 'lodash';

const $ref = falcor.Model.ref;

export const routes = [
  {
    route: "articles['length']",
    get: async () => {
      const length = await getNumArticles();
      return [
        {
          path: ['articles', 'length'],
          value: length,
        },
      ];
    },
  },
  {
    route: "articles['createNew']",
    call: async (callPath, args) => {
      const article = args[0];
      if (!article || !article.title || !article.slug) {
        logger.error(
          new Error(
            "articles['createNew'] must be provided both a slug and a title",
          ),
        );
        throw new Error(buildErrorMessage());
      }
      const createdArticle = await createNewArticle(database, article);
      if (!createdArticle.id) {
        logger.error(
          new Error('New article returned from db must include an id'),
        );
        throw new Error(buildErrorMessage());
      }
      const pathPrefix = ['articles', 'byId', createdArticle.id];
      let processedFields = 0;
      const standardFields = ['id', 'slug', 'title', 'teaser', 'image_url'];
      const results = standardFields
        .map(field => {
          if (has.call(createdArticle, field)) {
            processedFields += 1;
            return {
              path: pathPrefix.concat([field]),
              value: createdArticle[field],
            };
          }
          return null;
        })
        .filter(x => x !== null);
      if (has.call(createdArticle, 'category_id')) {
        processedFields += 1;
        results.push({
          path: pathPrefix.concat(['category']),
          value: $ref(['categories', 'byId', createdArticle.category_id]),
        });
      }
      if (has.call(createdArticle, 'authors')) {
        processedFields += 1;
        results.push(
          ...createdArticle.authors.map((authorRow, index) => ({
            path: pathPrefix.concat(['authors', index]),
            value: $ref(['staff', 'byId', authorRow.author_id]),
          })),
        );
      }
      if (has.call(createdArticle, 'tags')) {
        processedFields += 1;
        results.push(
          ...createdArticle.tags.map((tagRow, index) => ({
            path: pathPrefix.concat(['tags', index]),
            value: $ref(['tags', 'byId', tagRow.tag_id]),
          })),
        );
      }

      if (
        processedFields !==
        Object.keys(_.omit(createdArticle, ['created_at'])).length
      ) {
        logger.warn(
          new Error(
            `Expected every key from the created article to be used\nProcessed fields: ${JSON.stringify(
              processedFields,
            )}\nArticle Fields: ${JSON.stringify(Object.keys(createdArticle))}`,
          ),
        );
      }

      results.push({
        path: ['articles', 'byPage'],
        invalidated: true,
      });
      return results;
    },
  },
];
