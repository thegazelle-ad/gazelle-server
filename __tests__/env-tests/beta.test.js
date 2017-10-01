process.env.NODE_ENV = 'beta';
/**
 * We use require here as the ES6 import seems to automatically be hoisted to the top
 * before we redefine process.env.NODE_ENV.
 */
const utilities = require('lib/__tests__/utilities.env-tests.js').beta;

describe('beta', () => {
  utilities();
});
