import { getPaginatedArticle, createNewArticle } from '../database-calls.sql';
import {
  getDatabaseConnection,
  initializeTestDatabase,
  cleanupTestDatabase,
} from '__tests__/helpers/db-helpers';
import path from 'path';
import MockDate from 'mockdate';
import { buildErrorMessage } from 'lib/error-helpers';
import { logger } from 'lib/logger';

jest.mock('lib/logger');

const name = path
  .basename(__filename)
  .replace(/[.-]/g, '_')
  .replace(/^_+/, '');

const databaseName = `gazelle_test_${name}_${new Date().getTime()}`;

const database = getDatabaseConnection(databaseName);

const maxSlugNum = 200;

// End the knex connection after all tests are done
afterAll(async () => database.destroy());

describe('getPaginatedArticle', () => {
  // We can use All instead of Each as these are only select queries
  beforeAll(async () => initializeTestDatabase(database, databaseName));
  afterAll(async () => cleanupTestDatabase(databaseName));

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

describe('createNewArticle', () => {
  const insertMock = jest.fn().mockResolvedValue([1]);
  const databaseMock = jest.fn().mockReturnValue({ insert: insertMock });

  beforeAll(() => {
    // The number is irellevant as long as it is constant, this was the time the test
    // was written. It makes new Date() always return the same value so we can make
    // assertions about it (otherwise it would always return current time)
    MockDate.set(1524998880085);
  });

  afterAll(() => {
    MockDate.reset();
  });

  afterEach(() => {
    insertMock.mockClear();
    logger.__mockClear();
  });

  it('has expected input and output', async () => {
    const articleData = {
      slug: 'test-slug',
      title: 'test-title',
      teaser: 'test-teaser',
      imageUrl: 'https://google.com/img.png',
      category: 3,
      authors: [{ id: 1 }, { id: 2 }],
      tags: [{ id: 5 }, { id: 6 }],
    };
    const createdArticle = await createNewArticle(databaseMock, articleData);
    expect(createdArticle).toMatchSnapshot();
    expect(insertMock.mock.calls).toMatchSnapshot();
    articleData.authors.forEach((author, index) => {
      expect(author.id).toBe(createdArticle.authors[index].author_id);
    });
    articleData.tags.forEach((tag, index) => {
      expect(tag.id).toBe(createdArticle.tags[index].tag_id);
    });
  });

  it('errors on invalid author passed', async () => {
    const articleData = {
      authors: [{ slug: 'slug' }],
      slug: 'slug',
      title: 'title',
    };

    await expect(
      createNewArticle(databaseMock, articleData),
    ).rejects.toThrowError(buildErrorMessage());
    expect(logger.error.mock.calls).toMatchSnapshot();
  });

  it('errors on invalid tag passed', async () => {
    const articleData = {
      tags: [{ slug: 'slug' }],
      slug: 'slug',
      title: 'title',
    };

    await expect(
      createNewArticle(databaseMock, articleData),
    ).rejects.toThrowError(buildErrorMessage());
    expect(logger.error.mock.calls).toMatchSnapshot();
  });

  it('works with minimal input', async () => {
    // We just want to know it didn't error, so it's fine without any expect statements
    await createNewArticle(databaseMock, { slug: 'slug', title: 'title' });
  });

  it('throws without any slug', async () => {
    await expect(
      createNewArticle(databaseMock, { title: 'title' }),
    ).rejects.toThrowErrorMatchingSnapshot();
    expect(logger.warn.mock.calls).toMatchSnapshot();
  });

  it('throws without any title', async () => {
    await expect(
      createNewArticle(databaseMock, { slug: 'slug' }),
    ).rejects.toThrowErrorMatchingSnapshot();
    expect(logger.warn.mock.calls).toMatchSnapshot();
  });
});
