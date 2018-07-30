import _ from 'lodash';
import {
  validateFalcorPathSets,
  cleanupFalcorKeys,
} from 'lib/falcor/falcor-utilities';
import BaseComponent from 'lib/BaseComponent';
import { setLoading, signalLeaving } from 'lib/loader';
import { has, uuid } from 'lib/utilities';
import { logger } from 'lib/logger';

// Abstract class for fetching falcor objects
export default class FalcorController extends BaseComponent {
  constructor(props) {
    super(props);
    if (this.constructor === FalcorController) {
      throw new TypeError('FalcorController is abstract');
    }
    // It might seem like fetching and ready are redundant
    // But you can be ready = true and fetching = true if
    // doing a refresh on data
    this.safeSetState({
      fetching: false,
      ready: false,
      data: null,
    });

    // For loader tracking
    this.uuid = uuid();
    // Uniquely identifies a data request, so we know to ignore old requests
    this.lastRequestId = null;
  }

  // Return falcor paths as specified by:
  // http://netflix.github.io/falcor/documentation/paths.html
  // FalcorPath can depend on props only (to get server side rendering working)
  // Also you cannot as of now make the first keySet in a pathSet an array
  // as being able to pass an array of pathSets properly depends on that.
  // This will probably never be needed either.
  // eslint-disable-next-line no-unused-vars
  static getFalcorPathSets(params, queryParams) {
    // eslint-disable-line no-unused-vars
    throw new TypeError(
      'You must implement the getFalcorPathSets method ' +
        'in children of FalcorController',
    );
  }

  // Makes falcor fetch its paths
  falcorFetch(falcorPathSets, stateToSet = {}, callback) {
    const processedFalcorPathSets = validateFalcorPathSets(falcorPathSets);
    if (processedFalcorPathSets === undefined) {
      this.safeSetState({
        ready: true,
        data: null,
      });
      if (callback) {
        callback(null);
      }
      return Promise.resolve();
    }

    this.safeSetState({ fetching: true });
    setLoading(this.uuid, true);
    const requestId = uuid();
    this.lastRequestId = requestId;
    return this.props.model
      .get(...processedFalcorPathSets)
      .then(x => {
        if (this.lastRequestId !== requestId) {
          // stale request, no action to response
          if (callback) {
            callback(null);
          }
          return;
        }

        setLoading(this.uuid, false);
        if (x) {
          Object.assign(stateToSet, {
            ready: true,
            fetching: false,
            data: cleanupFalcorKeys(x.json),
          });
          this.safeSetState(stateToSet);
          if (callback) {
            callback(cleanupFalcorKeys(x.json));
          }
        } else {
          const err = new Error(
            `FalcorPathSets: ${JSON.stringify(
              processedFalcorPathSets,
            )} returned no data.`,
          );
          if (process.env.NODE_ENV !== 'production') {
            logger.error(err);
          }
          Object.assign(stateToSet, {
            ready: true,
            fetching: false,
            data: null,
          });
          this.safeSetState(stateToSet);
        }
      })
      .catch(e => {
        if (process.env.NODE_ENV !== 'production') {
          logger.error(e);
          if (e instanceof Error) {
            logger.error(e.stack);
          }
        }
      });
  }

  // This will update the values in the database through falcor
  // and update the cache accordingly
  falcorUpdate(jsonGraphEnvelope, stateToSet = {}, callback) {
    this.safeSetState({ fetching: true });
    return this.props.model
      .set(jsonGraphEnvelope)
      .then(() => {
        // For now we'll just fetch every time after an update
        // This would be very bad for updating views, so maybe we'll do that differently
        // but at the moment we have no good way to merge updated data especially when
        // we're deleting
        const pathSets = this.constructor.getFalcorPathSets(
          this.props.params,
          this.props.location.query,
        );
        this.falcorFetch(pathSets, stateToSet, callback);
      })
      .catch(e => {
        if (process.env.NODE_ENV !== 'production') {
          logger.error(e);
          if (e instanceof Error) {
            logger.error(e.stack);
          }
        }
        let error = null;
        if (e instanceof Error) {
          error = e;
        } else if (has.call(e, '0')) {
          error = e[0].value;
        }
        const errorMessage =
          'There was an error while updating data, please contact the developers, ' +
          'and we recommend refreshing the page' +
          `${
            error !== null ? `. The error message was: ${error.message}` : ''
          }`;
        // This is why we don't want to do inheritance but instead use composition, there could
        // be issues here if we tried using this.props.displayConfirm as the child class would have
        // to use the HOC, we can't use the HOC on this class itself because it's abstract.
        // eslint-disable-next-line no-alert
        window.alert(errorMessage);
      });
  }

  // This function lets you call one of the functions specified
  // in the Falcor Router and it will update the state of the data
  // according to what the function returns
  falcorCall(
    functionPath, // The path to the function in the falcor Router
    args = [], // An array of arguments to pass to the function
    refSuffixes = [], // These paths will be appended to all refs returned and fetched
    thisPaths = [], // The paths to fetch from the parent of functionPath
    stateToSet = {},
    callback,
  ) {
    this.safeSetState({ fetching: true });
    // for some reason 'call' can't handle undefined arguments
    // so we use .apply on it
    return this.props.model
      .call(functionPath, args, refSuffixes, thisPaths)
      .then(() => {
        // For now we'll just fetch every time after an update
        // This would be very bad for updating views, so maybe we'll do that differently
        // but at the moment we have no good way to merge updated data especially when
        // we're deleting
        const pathSets = this.constructor.getFalcorPathSets(
          this.props.params,
          this.props.location.query,
        );
        this.falcorFetch(pathSets, stateToSet, callback);
      })
      .catch(e => {
        if (process.env.NODE_ENV !== 'production') {
          logger.error(e);
          if (e instanceof Error) {
            logger.error(e.stack);
          }
        }
        let error = null;
        if (e instanceof Error) {
          error = e;
        } else if (has.call(e, '0')) {
          error = e[0].value;
        }
        const errorMessage =
          'There was an error while updating data, please contact the developers, ' +
          'and we recommend refreshing the page' +
          `${
            error !== null ? `. The error message was: ${error.message}` : ''
          }`;
        // This is why we don't want to do inheritance but instead use composition, there could
        // be issues here if we tried using this.props.displayConfirm as the child class would have
        // to use the HOC, we can't use the HOC on this class itself because it's abstract.
        // eslint-disable-next-line no-alert
        window.alert(errorMessage);
      });
  }

  // If the new props requires a new falcor call
  // this will pick it up and refresh the falcor state
  // The falcorCallback argument will only ever be passed by an extended component
  // overwriting the function. This is so we don't have to copy the code and maintain
  // it several places
  componentWillReceiveProps(nextProps, nextContext, falcorCallback) {
    const newPathSets = this.constructor.getFalcorPathSets(
      nextProps.params,
      nextProps.location.query,
    );
    const oldPathSets = this.constructor.getFalcorPathSets(
      this.props.params,
      this.props.location.query,
    );
    if (!_.isEqual(oldPathSets, newPathSets)) {
      this.safeSetState({ ready: false });
      this.falcorFetch(newPathSets, undefined, falcorCallback);
    }
  }

  // The falcorCallback argument will only ever be passed by an extended component
  // overwriting the function. This is so we don't have to copy the code and maintain
  // it several places
  componentWillMount(falcorCallback) {
    const falcorPathSets = this.constructor.getFalcorPathSets(
      this.props.params,
      this.props.location.query,
    );
    this.falcorFetch(falcorPathSets, undefined, falcorCallback);
  }

  componentWillAppear(cb) {
    cb();
  }

  componentWillEnter(cb) {
    cb();
  }
  componentWillLeave(cb) {
    signalLeaving(cb);
  }
}
