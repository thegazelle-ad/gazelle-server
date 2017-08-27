import { ghostArticleQuery } from 'lib/ghost-api';

export default [
  {
    // Get total amount of articles
    route: 'totalAmountOfArticles',
    get: () => (
      new Promise((resolve) => {
        ghostArticleQuery('limit=1&fields=slug').then((data) => {
          resolve([{
            path: ['totalAmountOfArticles'],
            value: data.meta.pagination.total,
          }]);
        });
      })
    ),
  },
];
