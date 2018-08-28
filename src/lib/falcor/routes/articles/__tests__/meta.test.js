import { routes } from '../meta';
import * as dbMethods from '../database-calls.sql';
import { logger } from 'lib/logger';

jest.mock('lib/db');
jest.mock('lib/logger');

const createNewArticlePath = "articles['createNew']";
const createNewArticleRoute = routes.find(
  x => x.route === createNewArticlePath,
);

expect(createNewArticleRoute).not.toBeUndefined();

describe('create new article falcor route', () => {
  dbMethods.createNewArticle = jest.fn().mockResolvedValue({ id: 1 });

  afterEach(() => {
    dbMethods.createNewArticle.mockClear();
    logger.__mockClear();
  });

  it("throws if there isn't an argument", async () => {
    await expect(
      createNewArticleRoute.call(createNewArticlePath, undefined),
    ).rejects.toThrowErrorMatchingSnapshot();
    expect(logger.error.mock.calls).toMatchSnapshot();
  });

  it('throws if article has no title', async () => {
    await expect(
      createNewArticleRoute.call(createNewArticlePath, [{ slug: 'slug' }]),
    ).rejects.toThrowErrorMatchingSnapshot();
    expect(logger.error.mock.calls).toMatchSnapshot();
  });

  it('throws if article has no slug', async () => {
    await expect(
      createNewArticleRoute.call(createNewArticlePath, [{ title: 'title' }]),
    ).rejects.toThrowErrorMatchingSnapshot();
    expect(logger.error.mock.calls).toMatchSnapshot();
  });

  it('passes article through to the database method', async () => {
    const article = {
      title: 'title',
      slug: 'slug',
    };

    await createNewArticleRoute.call(createNewArticlePath, [article]);
    expect(dbMethods.createNewArticle).toHaveBeenCalledTimes(1);
    expect(dbMethods.createNewArticle.mock.calls[0][1]).toBe(article);
  });

  it('returns expected path sets', async () => {
    dbMethods.createNewArticle.mockResolvedValueOnce({
      authors: [
        {
          article_id: 1,
          author_id: 1,
        },
        {
          article_id: 1,
          author_id: 2,
        },
      ],
      category_id: 3,
      created_at: new Date('2018-04-29T10:48:00.085Z'),
      id: 1,
      image_url: 'https://google.com/img.png',
      slug: 'test-slug',
      tags: [
        {
          article_id: 1,
          tag_id: 5,
        },
        {
          article_id: 1,
          tag_id: 6,
        },
      ],
      teaser: 'test-teaser',
      title: 'test-title',
    });
    await expect(
      createNewArticleRoute.call(createNewArticlePath, [
        { title: 'title', slug: 'slug' },
      ]),
    ).resolves.toMatchSnapshot();
  });
});
