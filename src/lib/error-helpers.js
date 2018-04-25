const defaultError =
  'An error occured, the developers of The Gazelle have been notified';

/**
 * Builds a generic error message
 * @param {string} [msg] - The reason for the error
 * @returns {string}
 */
export const buildErrorMessage = msg => {
  if (!msg) {
    return defaultError;
  }
  return `${defaultError}\nReason: ${msg}`;
};
