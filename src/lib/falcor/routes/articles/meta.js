import { getNumArticles } from 'lib/db';

export default [
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
];
