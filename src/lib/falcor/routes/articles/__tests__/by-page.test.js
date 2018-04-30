import { routes } from '../by-page';

// database-calls is automatically mocked as seen in __mocks__
jest.enableAutomock();
jest.unmock('../by-page');
jest.unmock('lodash');
jest.unmock('falcor');

const mainRoutePath =
  "articles['byPage'][{integers:pageLengths}][{integers:pageIndices}][{integers:indicesOnPage}]";
const mainRoute = routes.find(x => x.route === mainRoutePath);

expect(mainRoute).not.toBeUndefined();

describe('articlesByPage falcor routes', () => {
  it('returns correct path values', async () => {
    const pageLength = 5;
    const pageIndex = 0;
    const pathValues = await mainRoute.get({
      pageLengths: [pageLength],
      pageIndices: [pageIndex],
      indicesOnPage: [0, 1, 2, 3, 4],
    });
    expect(pathValues).toMatchSnapshot();
  });

  it('throws on several pages requested', () =>
    expect(
      mainRoute.get({
        pageLengths: [1],
        pageIndices: [1, 2],
        indicesOnPage: [0],
      }),
    ).rejects.toThrow());

  it('throws on negative page index requested', () =>
    expect(
      mainRoute.get({
        pageLengths: [1],
        pageIndices: [-1],
        indicesOnPage: [0],
      }),
    ).rejects.toThrow());

  it('throws on negative pageLength requested', () =>
    expect(
      mainRoute.get({
        pageLengths: [-1],
        pageIndices: [2],
        indicesOnPage: [0],
      }),
    ).rejects.toThrow());

  it('throws on several page lengths requested', () =>
    expect(
      mainRoute.get({
        pageLengths: [1, 2],
        pageIndices: [2],
        indicesOnPage: [0],
      }),
    ).rejects.toThrow());

  it('throws when not all elements of a page were requested', () =>
    expect(
      mainRoute.get({
        pageLengths: [2],
        pageIndices: [2],
        indicesOnPage: [0],
      }),
    ).rejects.toThrow());

  it('throws when out of range element on page is requested', () =>
    expect(
      mainRoute.get({
        pageLengths: [2],
        pageIndices: [2],
        indicesOnPage: [0, 2],
      }),
    ).rejects.toThrow());

  it('throws when negative index on page is requested', () =>
    expect(
      mainRoute.get({
        pageLengths: [2],
        pageIndices: [2],
        indicesOnPage: [-1, 0],
      }),
    ).rejects.toThrow());

  it('throws if duplicate indices on page are requested', () =>
    expect(
      mainRoute.get({
        pageLengths: [2],
        pageIndices: [2],
        indicesOnPage: [0, 0],
      }),
    ).rejects.toThrow());
});
