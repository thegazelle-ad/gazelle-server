/* eslint-disable */
/* Remove the eslint-disable when you remove the .skip and refactor this to fit with jest 20 */
import { updateFieldValue, trimField } from '../form-field-updaters';

describe.skip('updateFieldValue', () => {
  beforeEach(() => {
    // Simple implementation of our setState
    const safeSetState = function(updater) {
      if (typeof updater !== 'function') {
        const newState = Object.assign({}, updater);
        updater = () => newState;
      }
      this.state = Object.assign({}, this.state, updater(this.state));
    };

    this.setupTestEnvironment = initialState => {
      if (!initialState) {
        throw new Error('setupTestEnvironment needs an initialState');
      }

      // Setup the event object for use but expect test to fill in value itself
      this.e = {
        target: {},
      };

      // Create mock component
      const _this = {};
      _this.safeSetState = safeSetState.bind(_this);
      _this.state = initialState;
      return _this;
    };
  });

  // Test the safeSetState we just wrote above
  describe('.test.safeSetState', () => {
    it('handles function argument', () => {
      const _this = this.setupTestEnvironment({ a: 1 });

      _this.safeSetState(prevState => ({ a: prevState.a + 1 }));
      expect(_this.state).toEqual({ a: 2 });

      _this.safeSetState(prevState => ({ a: 5 }));
      expect(_this.state).toEqual({ a: 5 });

      _this.safeSetState(prevState => ({ a: 17, b: 3 }));
      expect(_this.state).toEqual({ a: 17, b: 3 });

      _this.safeSetState(prevState => ({ b: 10 }));
      expect(_this.state).toEqual({ a: 17, b: 10 });
    });

    it('handles object argument', () => {
      const _this = this.setupTestEnvironment({ a: 1 });

      _this.safeSetState({ a: 5 });
      expect(_this.state).toEqual({ a: 5 });

      _this.safeSetState({ a: 17, b: 3 });
      expect(_this.state).toEqual({ a: 17, b: 3 });

      _this.safeSetState({ b: 10 });
      expect(_this.state).toEqual({ a: 17, b: 10 });
    });
  });

  it('updates state with simple keys', () => {
    const _this = this.setupTestEnvironment({ a: 'initial' });
    const e = this.e;
    const key = 'a';
    const boundUpdate = updateFieldValue.bind(_this, key, undefined);

    e.target.value = 'test';
    boundUpdate(e);
    expect(_this.state).toEqual({ a: 'test' });
  });

  it('updates state with complex keys', () => {
    const initialState = {
      form: {
        subset: {
          keyA: 'initial',
        },
      },
    };
    const targetState = {
      form: {
        subset: {
          keyA: 'test',
        },
      },
    };

    const _this = this.setupTestEnvironment(initialState);
    const e = this.e;
    const key = 'form.subset.keyA';
    const boundUpdate = updateFieldValue.bind(_this, key, undefined);

    e.target.value = 'test';
    boundUpdate(e);
    expect(_this.state).toEqual(targetState);
  });

  it("doesn't delete other keys in nested objects", () => {
    const initialState = {
      form: {
        subset: {
          keyA: 'initial',
          keyB: 'dummyB',
          keyC: 'dummyC',
        },
      },
    };
    const targetState = {
      form: {
        subset: {
          keyA: 'test',
          keyB: 'dummyB',
          keyC: 'dummyC',
        },
      },
    };

    const _this = this.setupTestEnvironment(initialState);
    const e = this.e;
    const key = 'form.subset.keyA';
    const boundUpdate = updateFieldValue.bind(_this, key, undefined);

    e.target.value = 'test';
    boundUpdate(e);
    expect(_this.state).toEqual(targetState);
  });

  it('handles sequential updates', () => {
    const _this = this.setupTestEnvironment({ a: 'initial' });
    const e = this.e;
    const key = 'a';
    const boundUpdate = updateFieldValue.bind(_this, key, undefined);

    e.target.value = 'first';
    boundUpdate(e);
    expect(_this.state).toEqual({ a: 'first' });

    e.target.value = 'second';
    boundUpdate(e);
    expect(_this.state).toEqual({ a: 'second' });
  });

  it('throws error correctly relating to keypath', () => {
    const _this = this.setupTestEnvironment({ a: 'initial' });
    const e = this.e;
    e.target.value = 'test';

    const key1 = 'b';
    const boundUpdate1 = updateFieldValue.bind(_this, key1, undefined);
    expect(boundUpdate1.bind(null, e)).not.toThrow();

    _this.state = { a: 'initial' };
    const key2 = 'a.b';
    const boundUpdate2 = updateFieldValue.bind(_this, key2, undefined);
    expect(boundUpdate2.bind(null, e)).toThrow();

    _this.state = { a: 'initial' };
    const key3 = 'b.c';
    const boundUpdate3 = updateFieldValue.bind(_this, key3, undefined);
    expect(boundUpdate3.bind(null, e)).toThrow();
  });

  it('throws error on invalid option', () => {
    const _this = this.setupTestEnvironment({ a: 'initial' });
    const e = this.e;
    const key = 'a';
    const boundUpdate = updateFieldValue.bind(_this, key);

    const options = {
      invalidOption: 'test',
    };
    expect(boundUpdate.bind(null, options, e)).toThrow();

    // Check when there is also a valid one
    options.isMaterialSelect = true;
    expect(boundUpdate.bind(null, options, e)).toThrow();
  });

  it('handles Material Select element correctly', () => {
    const _this = this.setupTestEnvironment({ a: 'initial' });
    const e = this.e;
    const key = 'a';
    const options = {
      isMaterialSelect: true,
    };
    const boundUpdate = updateFieldValue.bind(_this, key, options);

    e.target.value = 'wrong';
    const value = 'right';
    boundUpdate(e, null, value);
    expect(_this.state).toEqual({ a: 'right' });
  });

  it('handles trim option', () => {
    const _this = this.setupTestEnvironment({ a: 'initial' });
    const e = this.e;
    const key = 'a';
    const options = {
      trim: 5,
    };
    const boundUpdate = updateFieldValue.bind(_this, key, options);

    e.target.value = 'hello this is a test';
    boundUpdate(e);
    expect(_this.state).toEqual({ a: 'hello' });
  });
});

describe('trimField', () => {
  // 20 characters long value
  const value = 'hello this is a test';

  it('trims field', () => {
    expect(trimField(5, value)).toBe('hello');

    expect(trimField(25, value)).toBe(value);
  });

  it('handles empty/null values', () => {
    expect(trimField(5, '')).toBe('');

    expect(trimField(5, null)).toBe('');

    expect(trimField(5, undefined)).toBe('');
  });
});
