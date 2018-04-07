import { cleanupFalcorKeys } from '../falcor-utilities';

describe('cleanupFalcorKeys', () => {
  it('removes $__path keys and not normal keys', () => {
    const test = {
      a: {
        b: 3,
        $__path: ['a', 'b', 'c'],
      },
      $__path: ['whatever', 'asd'],
    };
    const expected = {
      a: {
        b: 3,
      },
    };
    expect(cleanupFalcorKeys(test)).toEqual(expected);
  });

  it('removes otherwise empty results', () => {
    const test = {
      a: {
        b: 3,
        c: {
          $__path: ['a', 'b', 'c'],
          0: {
            a: 3,
            $__path: ['a', 'b', 'c'],
          },
          1: {
            $__path: ['a', 'b', 'c'],
          },
        },
        $__path: ['a', 'b', 'c'],
      },
      $__path: ['whatever', 'asd'],
    };
    const expected = {
      a: {
        b: 3,
        c: {
          0: {
            a: 3,
          },
        },
      },
    };
    expect(cleanupFalcorKeys(test)).toEqual(expected);
  });

  it('handles null values', () => {
    const test = {
      a: {
        b: 3,
        c: null,
      },
      b: null,
    };
    expect(cleanupFalcorKeys(test)).toEqual(test);
  });

  it('handles circular objects', () => {
    const a = {
      b: 5,
    };
    const test = {
      a,
    };
    a.c = test;
    expect(cleanupFalcorKeys(test)).toEqual(test);
  });

  it('removes recursively empty results', () => {
    const test = {
      a: {
        b: 3,
        c: {
          0: {
            name: undefined,
            slug: undefined,
          },
          1: {
            a: undefined,
            b: {
              0: undefined,
              1: undefined,
            },
          },
        },
      },
    };
    const expected = {
      a: {
        b: 3,
      },
    };
    expect(cleanupFalcorKeys(test)).toEqual(expected);
  });

  it('handles circular empty results', () => {
    const test = {
      a: {
        b: 3,
        c: {
          0: {
            name: undefined,
            slug: undefined,
          },
          1: {
            a: undefined,
            b: {
              0: undefined,
              1: undefined,
            },
          },
        },
      },
    };
    test.a.c[0].backReference = test.a.c;
    const expected = {
      a: {
        b: 3,
      },
    };
    expect(cleanupFalcorKeys(test)).toEqual(expected);
  });
});
