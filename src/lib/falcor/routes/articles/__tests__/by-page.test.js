import { articlesByPageRoutes } from '../by-page';

jest.enableAutomock();
jest.unmock('../by-page');
jest.unmock('lodash');
jest.unmock('falcor');

describe('articlesByPage falcor routes', () => {
  // More to make sure we didn't miss any
  it('has only 1 route', () => {
    expect(articlesByPageRoutes.length).toBe(1);
  });

  it('is the right route we are testing', () => {
    expect(articlesByPageRoutes[0].route).toBe(
      "articles['byPage'][{integers:pageLengths}][{integers:pageIndices}][{integers:indicesOnPage}]",
    );
  });

  it('returns correct path values', async () => {
    const pageLength = 5;
    const pageIndex = 2;
    const pathValues = await articlesByPageRoutes[0].get({
      pageLengths: [pageLength],
      pageIndices: [pageIndex],
      indicesOnPage: [0, 1, 2, 3, 4],
    });
    expect(pathValues).toMatchSnapshot();
  });

  it('throws on several pages requested', () =>
    expect(
      articlesByPageRoutes[0].get({
        pageLengths: [1],
        pageIndices: [1, 2],
        indicesOnPage: [0],
      }),
    ).rejects.toThrow());

  it('throws on negative page index requested', () =>
    expect(
      articlesByPageRoutes[0].get({
        pageLengths: [1],
        pageIndices: [-1],
        indicesOnPage: [0],
      }),
    ).rejects.toThrow());

  it('throws on negative pageLength requested', () =>
    expect(
      articlesByPageRoutes[0].get({
        pageLengths: [-1],
        pageIndices: [2],
        indicesOnPage: [0],
      }),
    ).rejects.toThrow());

  it('throws on several page lengths requested', () =>
    expect(
      articlesByPageRoutes[0].get({
        pageLengths: [1, 2],
        pageIndices: [2],
        indicesOnPage: [0],
      }),
    ).rejects.toThrow());

  it('throws when not all elements of a page were requested', () =>
    expect(
      articlesByPageRoutes[0].get({
        pageLengths: [2],
        pageIndices: [2],
        indicesOnPage: [0],
      }),
    ).rejects.toThrow());

  it('throws when out of range element on page is requested', () =>
    expect(
      articlesByPageRoutes[0].get({
        pageLengths: [2],
        pageIndices: [2],
        indicesOnPage: [0, 2],
      }),
    ).rejects.toThrow());

  it('throws when negative index on page is requested', () =>
    expect(
      articlesByPageRoutes[0].get({
        pageLengths: [2],
        pageIndices: [2],
        indicesOnPage: [-1, 0],
      }),
    ).rejects.toThrow());

  it('throws if duplicate indices on page are requested', () =>
    expect(
      articlesByPageRoutes[0].get({
        pageLengths: [2],
        pageIndices: [2],
        indicesOnPage: [0, 0],
      }),
    ).rejects.toThrow());
});
