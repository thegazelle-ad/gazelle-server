/**
 * Note that all the methods use arrow functions to bind 'this', this is so we
 * can pass them to the logger object to be called outside of the immediate
 * context of the Logger instance
 */
class Logger {
  constructor(isClient, displayAlert) {
    if (isClient === undefined) {
      throw new Error(
        'The logger constructor needs an isClient parameter supplied',
      );
    }
    if (isClient && !displayAlert) {
      throw new Error(
        'on the client the logger constructor needs a displayAlert function supplied',
      );
    }
    this.isClient = isClient;
    this.displayAlert = displayAlert;
  }

  /**
   * Logs a fatal error. This should only be called if an error occurred that
   * completely breaks our system and requires a complete system reboot.
   * On the client it will refresh the page after displaying an alert,
   * on the server it will exit the server which will make forever restart
   * the server.
   * @param {Error | string} err - The fatal error to be logged, either a string or
   * an Error object
   */
  fatal = async err => {
    const errorObject = err instanceof Error ? err : new Error(err);
    if (this.isClient) {
      await this.displayAlert(
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
  };

  /**
   * Logs an error. This should only be called on unexpected behaviour that should
   * never happen as long as everything works
   * @param {Error | string} err - The error to be logged, either a string or
   * an Error object
   */
  error = err => {
    const errorObject = err instanceof Error ? err : new Error(err);
    // eslint-disable-next-line no-console
    console.error(errorObject);
  };

  /**
   * Logs a warning. This should be called when an event occurs that is usually unwanted
   * but under certain circumstances could be okay
   * @param {Error | string} warn - The warning to be logged, either a string or
   * an Error object
   */
  warning = warn => {
    const errorObject = warn instanceof Error ? warn : new Error(warn);
    // eslint-disable-next-line no-console
    console.warn(errorObject);
  };

  /**
   * Logs a debug statement. This can be called whereever the developer thinks
   * information could be helpful to have when debugging. It is the lowest logging
   * level so will normally only be chosen to be shown in development mode
   * @param {Error | string} msg - The warning to be logged, either a string or
   * an Error object
   */
  debug = msg => {
    const errorObject = msg instanceof Error ? msg : new Error(msg);
    // eslint-disable-next-line no-console
    console.warn(errorObject);
  };
}

const uninitializedLogger = () => {
  throw new Error('The logger has yet to be initialized');
};

export const logger = {
  fatal: uninitializedLogger,
  error: uninitializedLogger,
  warning: uninitializedLogger,
  debug: uninitializedLogger,
};

let loggerInstance;

/**
 * @param {boolean} isClient - Whether we are currently on the client or the server
 * @param {func} [displayAlert] - This argument displays an alert on the client side
 * to the user, and should therefore only be supplied if isClient is true
 */
export const initializeLogger = (...args) => {
  loggerInstance = new Logger(...args);
  logger.fatal = loggerInstance.fatal;
  logger.error = loggerInstance.error;
  logger.warning = loggerInstance.warning;
  logger.debug = loggerInstance.debug;
};

/**
 * Should only be called on the client, and should be used for updating the alert
 * function to a prettier one that is not initialized before initial render.
 * Expected use case is using window.alert as default and then switching it when
 * React has initialized and a nicer alert function has been created.
 * @param {func} displayAlert - This argument displays an alert on the client side
 * to the user, and should therefore only be supplied if isClient is true
 */
export const updateDisplayAlert = displayAlert => {
  if (!displayAlert) {
    throw new Error(
      'updateDisplayAlert needs an alert function passed as a parameter',
    );
  }
  loggerInstance = new Logger(true, displayAlert);
  logger.fatal = loggerInstance.fatal;
  logger.error = loggerInstance.error;
  logger.warning = loggerInstance.warning;
  logger.debug = loggerInstance.debug;
};
