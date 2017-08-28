import { pathSetsInCache } from 'lib/falcor/falcor-utilities';

/* We skip this test for the moment as we aren't currently using this function
 * though we may in the future */

describe.skip('pathSetsInCache', () => {
  it('does find all pathSets', () => {
    const cache = {
      a: { a: { a: 1, b: 2 }, b: { a: 3 } },
      b: { b: { c: 3, d: 4 } },
      c: { e: { a: 3, f: 4 }, c: { k: 5, a: 2 }, b: { a: 5 } },
    };
    let pathSets = [['a', ['a', 'b'], 'a'], ['b', 'b', 'c'], ['c', 'c', 'k']];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);
    // Check if it can handle a single pathSet
    pathSets = ['a', 'b', 'a'];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);
  });

  it('does find missing pathSets', () => {
    const cache = {
      a: { a: { a: 1, b: 2 }, b: { a: 3 } },
      b: { b: { c: 3, d: 4 } },
      c: { e: { a: 3, f: 4 }, c: { k: 5, a: 2 }, b: { a: 5 } },
    };
    const pathSets = [['a', ['a', 'b'], ['a', 'b']], ['b', 'b', 'c'], [['c', 'c', 'k']]];
    expect(pathSetsInCache(cache, pathSets)).toBe(false);
  });

  it('handles ranges', () => {
    const cache = {
      a: [3, 3, 3, 3, 3],
    };
    let pathSets = ['a', { to: 4 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);

    pathSets = ['a', { from: 3, to: 4 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);

    pathSets = ['a', { length: 5 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);

    pathSets = ['a', { from: 3, length: 2 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);

    pathSets = ['a', { from: 2, to: 4 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);

    pathSets = ['a', { from: 2, to: 4, length: 3 }];
    expect(() => { pathSetsInCache(cache, pathSets); }).toThrow();

    pathSets = ['a', { from: 2 }];
    expect(() => { pathSetsInCache(cache, pathSets); }).toThrow();
  });

  it('handles overfetching', () => {
    let cache = {
      a: {
        0: 2,
        1: 3,
        2: 6,
        3: 4,
      },
    };
    // it has no length property so it should return false
    // as the function will expect this mean the data isn't in cache.
    // It will also warn the developer that it might be a dev error though.
    let pathSets = ['a', { to: 3 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(false);

    pathSets = ['a', { length: 2 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(false);

    pathSets = ['a', { length: 20 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(false);

    // Now we check if we can overfetch and still be told data
    // is in cache.
    cache.a.length = 4;
    pathSets = ['a', { length: 20 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);

    pathSets = ['a', { from: 30, length: 20 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);

    // We already know from ranges it handles a regular range
    // But now we check if it returns false on an incomplete cache
    cache = {
      a: {
        0: 2,
        1: 3,
        3: 1,
        4: 6,
        length: 20,
      },
    };
    pathSets = ['a', { length: 5 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(false);

    pathSets = ['a', { from: 3, length: 2 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);

    pathSets = ['a', { length: 10 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(false);

    pathSets = ['a', { length: 25 }];
    expect(pathSetsInCache(cache, pathSets)).toBe(false);
  });

  it('handles complex expressions', () => {
    const cache = {
      a: [1, 2, 3, 4, 5, 6],
    };
    cache.a.forEach((val, index) => {
      cache.a[index] = { b: { c: { a: val }, d: { a: val * 2 } } };
    });
    let pathSets = ['a', { length: 6 }, 'b', ['c', 'd'], 'a'];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);

    pathSets = ['a', { length: 6 }, 'b', ['c', 'd'], 'b'];
    expect(pathSetsInCache(cache, pathSets)).toBe(false);

    // Should be true due to overfetching handling
    pathSets = ['a', { from: 1, length: 10 }, 'b', ['c', 'd'], 'a'];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);

    cache.a.key = cache.a.key2 = cache.a.key3 = { b: { c: { a: 3 }, d: { a: 6 } } };
    // I'm actually not certain this is valid falcor syntax, but it is supported by the function.
    pathSets = ['a', [{ length: 6 }, 'key', 'key2', 'key3'], 'b', ['c', 'd'], 'a'];
    expect(pathSetsInCache(cache, pathSets)).toBe(true);
  });

  it('follows refs', () => {
    const cache = {
      articles: {
        someSlug: {
          name: 'someName',
          pubDate: 'someDate',
          authors: {
            0: { $type: 'ref', value: ['authors', 'someAuthor'] },
          },
        },
      },
      authors: {
        someAuthor: {
          name: 'someName',
          biography: 'this is me',
          articles: {
            0: { $type: 'ref', value: ['articles', 'someSlug'] },
          },
        },
      },
    };

    let pathSet = ['articles', 'someSlug', 'authors', 0, 'articles', 0, 'authors', 0, 'biography'];
    expect(pathSetsInCache(cache, pathSet)).toBe(true);

    pathSet = ['articles', 'someSlug', 'authors', 0, 'articles', 0, 'authors', 0, 'pubDate'];
    expect(pathSetsInCache(cache, pathSet)).toBe(false);
  });
});
