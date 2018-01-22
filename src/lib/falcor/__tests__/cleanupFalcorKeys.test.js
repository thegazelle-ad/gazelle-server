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
});
