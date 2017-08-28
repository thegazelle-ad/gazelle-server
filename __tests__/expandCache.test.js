import { expandCache } from 'lib/falcor/falcor-utilities';

describe('expandCache', () => {
  it('does expand atoms', () => {
    const cache = { key: { $type: 'atom', value: [1, 2, 3] } };
    expect(expandCache(cache)).toEqual({ key: [1, 2, 3] });
  });

  it('does expand errors', () => {
    const cache = { key: { $type: 'error', value: 'there was an error' } };
    expect(expandCache(cache)).toEqual({ key: new Error('there was an error') });
  });

  it('does expand refs', () => {
    const cache = {
      a: { $type: 'ref', value: ['b'] },
      b: {
        a: {
          a: 'b',
        },
        b: {
          a: 3,
          b: 2,
        },
      },
    };
    const expectedCache = {
      a: {
        a: {
          a: 'b',
        },
        b: {
          a: 3,
          b: 2,
        },
      },
      b: {
        a: {
          a: 'b',
        },
        b: {
          a: 3,
          b: 2,
        },
      },
    };
    const expandedCache = expandCache(cache);
    expect(expandedCache).toEqual(expectedCache);
  });

  it('does expand circular refs', () => {
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
    const expandedCache = expandCache(cache);
    expect(
      expandedCache
      .articles
      .someSlug
      .authors[0]
      .articles[0]
      .authors[0]
      .biography
    ).toBe('this is me');
  });

  it('handles chains of refs', () => {
    let cache = {
      a: { $type: 'ref', value: ['b', 'a'] },
      b: { a: { $type: 'ref', value: ['c', 'a'] } },
      c: { a: 1 },
    };
    let expectedCache = { a: 1, b: { a: 1 }, c: { a: 1 } };
    expect(expandCache(cache)).toEqual(expectedCache);

    // Check that it handles a chain to an atom
    cache = {
      a: { $type: 'ref', value: ['b', 'a'] },
      b: { a: { $type: 'ref', value: ['c', 'a'] } },
      c: { a: { $type: 'atom', value: ['a', 'b', 'c'] } },
    };
    expectedCache = { a: ['a', 'b', 'c'], b: { a: ['a', 'b', 'c'] }, c: { a: ['a', 'b', 'c'] } };
    expect(expandCache(cache)).toEqual(expectedCache);

    // Now check if it handles a chain to an error
    cache = {
      a: { $type: 'ref', value: ['b', 'a'] },
      b: { a: { $type: 'ref', value: ['c', 'a'] } },
      c: { a: { $type: 'error', value: ['there was an error'] } },
    };
    expectedCache = {
      a: new Error('there was an error'),
      b: { a: new Error('there was an error') },
      c: { a: new Error('there was an error') },
    };
    expect(expandCache(cache)).toEqual(expectedCache);

    // And now to make an empty loop that should throw an error
    cache = {
      a: { $type: 'ref', value: ['b', 'a'] },
      b: { a: { $type: 'ref', value: ['c', 'a'] } },
      c: { a: { $type: 'ref', value: ['a'] } },
    };
    expect(() => { expandCache(cache); }).toThrow();

    // And to check that if the loop is shorter than the whole length it still throws an error
    cache = {
      a: { $type: 'ref', value: ['b', 'a'] },
      b: { a: { $type: 'ref', value: ['c', 'a'] } },
      c: { a: { $type: 'ref', value: ['b', 'a'] } },
    };
    expect(() => { expandCache(cache); }).toThrow();
  });
});
