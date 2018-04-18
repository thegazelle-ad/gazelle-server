import { getPaginatedArticle } from '../database-calls';
import {
  getDatabaseConnection,
  createTestDatabase,
  cleanupTestDatabase,
} from '__tests__/helpers/db-helpers';
import path from 'path';

const name = path.basename(__filename).replace(/[.-]/g, '_');

const databaseName = `gazelle_test${name}${new Date().getTime()}`;

const database = getDatabaseConnection(databaseName);

describe('getPaginatedArticle', () => {
  beforeEach(() => createTestDatabase(databaseName));
  afterEach(() => cleanupTestDatabase(databaseName));

  it('tests', () => {
    expect(true).toBe(true);
  });
});
