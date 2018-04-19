import { getNumArticles } from 'lib/db';

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
      return [];
    },
  },
];
