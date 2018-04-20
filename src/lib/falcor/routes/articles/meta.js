import { getNumArticles, database } from 'lib/db';
import { logger } from 'lib/logger';
import { createNewArticle } from './database-calls';

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
        return [];
      }
      const success = await createNewArticle(database, article);
      if (!success) {
        return [];
      }
      return [];
    },
  },
];
