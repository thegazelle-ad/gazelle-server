/**
 * This test won't actually be run in this file, but in the __tests__/env-tests directory
 * in the root folder since it is not possible to run tests for different environments
 * in the same file when our function doesn't ascertain the environment when it runs
 * but rather when it is imported
 */
import { filterByEnvironment, isDevelopment, isStaging, isProduction } from 'lib/utilities';
jest.unmock('lib/utilities');

export const development = () => {
  describe('filterByEnvironment', () => {
    it('works with three arguments', () => {
      expect(filterByEnvironment('dev', 'beta', 'prod')).toBe('dev');
    });

    it('works with two arguments', () => {
      expect(filterByEnvironment('non-prod', 'prod')).toBe('non-prod');
    });

    it('throws with one argument', () => {
      expect(filterByEnvironment.bind(null, 'test')).toThrow();
    });
  });

  describe('isDevelopment', () => {
    it('is true', () => {
      expect(isDevelopment).toBe(true);
    });
  });

  describe('isStaging', () => {
    it('is false', () => {
      expect(isStaging).toBe(false);
    });
  });

  describe('isProduction', () => {
    it('is false', () => {
      expect(isProduction).toBe(false);
    });
  });
}

export const beta = () => {
  describe('filterByEnvironment', () => {
    it('works with three arguments', () => {
      expect(filterByEnvironment('dev', 'beta', 'prod')).toBe('beta');
    });

    it('works with two arguments', () => {
      expect(filterByEnvironment('non-prod', 'prod')).toBe('non-prod');
    });

    it('throws with one argument', () => {
      expect(filterByEnvironment.bind(null, 'test')).toThrow();
    });
  });

  describe('isDevelopment', () => {
    it('is false', () => {
      expect(isDevelopment).toBe(false);
    });
  });

  describe('isStaging', () => {
    it('is true', () => {
      expect(isStaging).toBe(true);
    });
  });

  describe('isProduction', () => {
    it('is false', () => {
      expect(isProduction).toBe(false);
    });
  });
}

export const production = () => {
  describe('filterByEnvironment', () => {
    it('works with three arguments', () => {
      expect(filterByEnvironment('dev', 'beta', 'prod')).toBe('prod');
    });

    it('works with two arguments', () => {
      expect(filterByEnvironment('non-prod', 'prod')).toBe('prod');
    });

    it('throws with one argument', () => {
      expect(filterByEnvironment.bind(null, 'test')).toThrow();
    });
  });

  describe('isDevelopment', () => {
    it('is false', () => {
      expect(isDevelopment).toBe(false);
    });
  });

  describe('isStaging', () => {
    it('is false', () => {
      expect(isStaging).toBe(false);
    });
  });

  describe('isProduction', () => {
    it('is true', () => {
      expect(isProduction).toBe(true);
    });
  });
}
