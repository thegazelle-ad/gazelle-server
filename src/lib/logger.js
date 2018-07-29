/**
 * This file exposes our logger in a module form. It has the private variables
 * isClient and displayAlert that can only be accessed through the exposed API
 * of initializeLogger and updateDisplayAlert. If you come from the object
 * oriented programming paradigm this is equivalent to the singleton pattern,
 * except we never even created a class so we don't need to bother with making
 * sure it only gets instantiated once as it is now impossible.
 *
 * the logger object is the actual logger to be imported, but before it is used
 * initializeLogger should be called somewhere in the global scope, and if on the
 * client side and you want to add a prettier displayAlert function that is not necessarily
 * available at the start of the process, you can later call updateDisplayAlert
 * to make this your displayAlert function.
 */
import _ from 'lodash';

let isClient = null;
let displayAlert = null;

function validateInitialization() {
  if (isClient === null || (isClient && !_.isFunction(displayAlert)))
    throw new Error('The logger has yet to be initialized');
}

export const logger = {
  /**
   * Logs a fatal error. This should only be called if an error occurred that
   * completely breaks our system and requires a complete reboot of the code.
   * On the client it will refresh the page after displaying an alert,
   * on the server it will exit the server which will make 'forever' restart
   * the server.
   * @param {Error | string} err - The fatal error to be logged, either a string or
   * an Error object
   */
  async fatal(err) {
    validateInitialization();

    const errorObject = err instanceof Error ? err : new Error(err);
    if (isClient) {
      // We are actually lying currently, as developers haven't been notified
      // when we hook up sentry we will be notifying developers though
      await displayAlert(
        'A fatal error has occurred, and the developers' +
          ' have been notified. We apologize for the inconvenience, and we are afraid' +
          ' that we will have to reload the page now',
      );
      window.location.reload(true);
    } else {
      // eslint-disable-next-line no-console
      console.error(
        'A fatal error occured, and the server is exiting. See the error below:',
      );
      // eslint-disable-next-line no-console
      console.error(errorObject);
      process.exit(1);
    }
  },

  /**
   * Logs an error. This should only be called on unexpected behaviour that should
   * never happen, but it doesn't completely break our system
   * @param {Error | string} err - The error to be logged, either a string or
   * an Error object
   */
  error(err) {
    validateInitialization();

    const errorObject = err instanceof Error ? err : new Error(err);
    // eslint-disable-next-line no-console
    console.error(errorObject);
  },

  /**
   * Logs a warning. This should be called when an event occurs that is usually unwanted
   * but under certain circumstances could be okay
   * @param {Error | string} warning - The warning to be logged, either a string or
   * an Error object
   */
  warn(warning) {
    validateInitialization();

    // eslint-disable-next-line no-console
    console.warn(warning);
  },

  /**
   * Logs a debug statement. This can be called whereever the developer thinks
   * information could be helpful to have when debugging. It is the lowest logging
   * level so will normally only be chosen to be shown in development mode
   * @param {Error | string} msg - The warning to be logged, either a string or
   * an Error object
   */
  debug(msg) {
    validateInitialization();

    // eslint-disable-next-line no-console
    console.log(msg);
  },
};

/**
 * @param {boolean} updatedIsClient - Whether we are currently on the client or the server
 * @param {func} [updatedDisplayAlert] - This argument displays an alert on the client side
 * to the user, and should therefore only be supplied if isClient is true
 */
export const initializeLogger = (updatedIsClient, updatedDisplayAlert) => {
  if (updatedIsClient === undefined) {
    throw new Error('initializeLogger needs an isClient parameter supplied');
  }
  if (updatedIsClient && !_.isFunction(updatedDisplayAlert)) {
    throw new Error(
      'On the client initializeLogger needs a displayAlert function supplied',
    );
  }
  isClient = updatedIsClient;
  displayAlert = updatedDisplayAlert;
};

/**
 * Should only be called on the client, and should be used for updating the alert
 * function to a prettier one that is not initialized before initial render.
 * Expected use case is using window.alert as default and then switching it when
 * React has initialized and a nicer alert function has been created.
 * @param {func} newDisplayAlert - This argument displays an alert on the client side
 * to the user, and should therefore only be supplied if isClient is true
 */
export const updateDisplayAlert = newDisplayAlert => {
  if (!_.isFunction(newDisplayAlert)) {
    throw new Error(
      'updateDisplayAlert needs an alert function passed as a parameter',
    );
  }
  displayAlert = newDisplayAlert;
};
