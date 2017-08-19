import { ghostArticleQuery } from 'lib/ghost-api';

export default [
  {
    route: "articles['length']",
    get: () => (
      new Promise((resolve) => {
        ghostArticleQuery('limit=1&fields=slug').then((data) => {
          resolve([{
            path: ['articles', 'length'],
            value: data.meta.pagination.total,
          }]);
        });
      })
    ),
  },
];
