import { getPaginatedArticle } from '../database-calls';
import {
  getDatabaseConnection,
  initializeTestDatabase,
  cleanupTestDatabase,
} from '__tests__/helpers/db-helpers';
import path from 'path';

const name = path.basename(__filename).replace(/[.-]/g, '_');

const databaseName = `gazelle_test${name}${new Date().getTime()}`;

const database = getDatabaseConnection(databaseName);

const maxSlugNum = 200;

// End the knex connection after all tests are done
afterAll(() => database.destroy());

describe('getPaginatedArticle', () => {
  // We can use All instead of Each as these are only select queries
  beforeAll(() => initializeTestDatabase(database, databaseName));
  afterAll(() => cleanupTestDatabase(databaseName));

  it('fetches expected rows from database', async () => {
    await expect(
      getPaginatedArticle(database, 5, 0),
    ).resolves.toMatchSnapshot();
  });

  it('fetches the newest article for page 0', async () => {
    await expect(getPaginatedArticle(database, 1, 0)).resolves.toEqual([
      { slug: `slug-${maxSlugNum}` },
    ]);
  });

  it('correctly computes offset', async () => {
    await expect(getPaginatedArticle(database, 1, 5)).resolves.toEqual([
      { slug: `slug-${maxSlugNum - 5}` },
    ]);
  });

  it('throws on negative page index', async () => {
    await expect(getPaginatedArticle(database, 1, -1)).rejects.toThrow();
  });

  it('throws on negative page length', async () => {
    await expect(getPaginatedArticle(database, -1, 5)).rejects.toThrow();
  });

  it('returns nothing on zero page length', async () => {
    await expect(getPaginatedArticle(database, 0, 5)).resolves.toEqual([]);
  });
});
