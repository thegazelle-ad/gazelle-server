// import falcor from 'falcor';

import { searchScoredQuery } from '../database-calls';

import {
  getDatabaseConnection,
  initializeTestDatabase,
  cleanupTestDatabase,
} from '__tests__/helpers/db-helpers';
import path from 'path';
import { titles, slugs, markdowns } from './dummy-search-articles';

const name = path
  .basename(__filename)
  .replace(/[.-]/g, '_')
  .replace(/^_+/, '');

const databaseName = `gazelle_test_${name}_${new Date().getTime()}`;

const database = getDatabaseConnection(databaseName);

afterAll(() => database.destroy());
describe('findRelaventArticles', () => {
  beforeAll(() => {
    initializeTestDatabase(database, databaseName);
    for (let i = 0; i < 5; i++) {
      database('articles').insert(() => ({
        title: titles[i],
        slug: slugs[i],
        markdown: markdowns[i],
      }));
    }
  });
  afterAll(() => cleanupTestDatabase(databaseName));
});

it('searches for potato', async () => {
  await expect(searchScoredQuery('potato', 1, 5)).toMatchSnapshot();
});

it('searches for football', async () => {
  await expect(searchScoredQuery('football', 1, 5)).toMatchSnapshot();
});

it('searches for hobbit', async () => {
  await expect(searchScoredQuery('hobbit', 1, 5)).toMatchSnapshot();
});
