jest.unmock('lib/falcor/falcorUtils');

import { expandCache } from 'lib/falcor/falcorUtils';
describe('expandCache', () => {
  it('does expand atoms', () => {
    const cache = {key: {$type: 'atom', value: [1, 2, 3]}};
    expect(expandCache(cache)).toEqual({key: [1, 2, 3]})
  });

  it('does expand errors', () => {
    const cache = {key: {$type: 'error', value: 'there was an error'}};
    const expandedCache = expandCache(cache);
    expect(expandedCache.key instanceof Error).toBe(true);
    expect(expandedCache.key.message).toBe('there was an error');
  });

  it('does expand refs', () => {
    const cache = {
      a: {$type: 'ref', value: ['b']},
      b: {
        a: {
          a: 'b'
        },
        b: {
          a: 3,
          b: 2
        }
      }
    };
    let expectedCache = {
      a: {
        a: {
          a: 'b'
        },
        b: {
          a: 3,
          b: 2
        }
      },
      b: {
        a: {
          a: 'b'
        },
        b: {
          a: 3,
          b: 2
        }
      }
    };
    let expandedCache = expandCache(cache);
    // Test it works generally
    expect(expandedCache).toEqual(expectedCache);
    expectedCache.a.a.a = 'c';
    // Make sure equals function is working correctly
    // and also outputting false when it should
    expect(expandedCache).not.toEqual(expectedCache);
    // Make sure they're equal again before next check
    // just to double check there are no human errors in the testing
    expectedCache.a.a.a = 'b';
    expect(expandedCache).toEqual(expectedCache);
    // Try different ref
    cache.a = {$type: 'ref', value: ['b', 'a']};
    expandedCache = expandCache(cache);
    // Make sure they're not equal anymore
    expect(expandedCache).not.toEqual(expectedCache);
    // Check that it behaves as it should when assigning the correct value
    expectedCache.a = {a: 'b'};
    expect(expandedCache).toEqual(expectedCache);
  });

  it('does expand circular refs', () => {
    const cache = {
      articles: {
        someSlug: {
          name: 'someName',
          pubDate: 'someDate',
          authors: {
            '0': {$type: 'ref', value: ['authors', 'someAuthor']}
          }
        }
      },
      authors: {
        someAuthor: {
          name: 'someName',
          biography: 'this is me',
          articles: {
            '0': {$type: 'ref', value: ['articles', 'someSlug']}
          }
        }
      }
    };
    const expandedCache = expandCache(cache);
    // console.log(JSON.stringify(expandedCache, null, 4));
    // console.log("next");
    // console.log(JSON.stringify(expandedCache.articles.someSlug.authors[0], null, 4));
    expect(expandedCache.articles.someSlug.authors[0].articles[0].authors[0].biography).toBe('this is me');
  })
})