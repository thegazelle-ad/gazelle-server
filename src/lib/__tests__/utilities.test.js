import {
  filterByEnvironment,
  isDevelopment,
  isStaging,
  isProduction,
} from 'lib/utilities';
// Using Sinon here as jest.doMock doesn't seem to be working and all other
// ways of mocking in Jest are local. Sinon is also nice so maybe we should
// just use it
import * as sinon from 'sinon';
import * as config from '../../config';

const sandbox = sinon.createSandbox();

afterEach(() => sandbox.restore());

describe('filterByEnvironment', () => {
  describe('development', () => {
    beforeEach(() => {
      sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'development' });
    });

    it('works with three arguments', () => {
      expect(filterByEnvironment('dev', 'staging', 'prod')).toBe('dev');
    });

    it('works with two arguments', () => {
      expect(filterByEnvironment('non-prod', 'prod')).toBe('non-prod');
    });

    it('throws with one argument', () => {
      expect(filterByEnvironment.bind(null, 'test')).toThrow();
    });
  });

  describe('staging', () => {
    beforeEach(() => {
      sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'staging' });
    });

    it('works with three arguments', () => {
      expect(filterByEnvironment('dev', 'staging', 'prod')).toBe('staging');
    });

    it('works with two arguments', () => {
      expect(filterByEnvironment('non-prod', 'prod')).toBe('non-prod');
    });

    it('throws with one argument', () => {
      expect(filterByEnvironment.bind(null, 'test')).toThrow();
    });
  });

  describe('production', () => {
    beforeEach(() => {
      sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'production' });
    });

    it('works with three arguments', () => {
      expect(filterByEnvironment('dev', 'staging', 'prod')).toBe('prod');
    });

    it('works with two arguments', () => {
      expect(filterByEnvironment('non-prod', 'prod')).toBe('prod');
    });

    it('throws with one argument', () => {
      expect(filterByEnvironment.bind(null, 'test')).toThrow();
    });
  });
});

describe('isDevelopment', () => {
  it('is true in development', () => {
    sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'development' });
    expect(isDevelopment()).toBe(true);
  });

  it('is false in staging', () => {
    sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'staging' });
    expect(isDevelopment()).toBe(false);
  });

  it('is false in production', () => {
    sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'production' });
    expect(isDevelopment()).toBe(false);
  });
});

describe('isStaging', () => {
  it('is false in development', () => {
    sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'development' });
    expect(isStaging()).toBe(false);
  });

  it('is true in staging', () => {
    sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'staging' });
    expect(isStaging()).toBe(true);
  });

  it('is false in production', () => {
    sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'production' });
    expect(isStaging()).toBe(false);
  });
});

describe('isProduction', () => {
  it('is false in development', () => {
    sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'development' });
    expect(isProduction()).toBe(false);
  });

  it('is false in staging', () => {
    sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'staging' });
    expect(isProduction()).toBe(false);
  });

  it('is true in production', () => {
    sandbox.stub(config, 'getConfig').returns({ NODE_ENV: 'production' });
    expect(isProduction()).toBe(true);
  });
});
