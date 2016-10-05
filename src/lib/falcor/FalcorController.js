import _ from "lodash";
import { isAppReady, expandCache, pathSetsInCache, validateFalcorPathSets, mergeUpdatedData } from "lib/falcor/falcorUtils";
import BaseComponent from "lib/BaseComponent";
import { setLoading, signalLeaving } from "lib/loader";
import { uuid } from 'lib/utilities';

// Abstract class for fetching falcor objects
export default class FalcorController extends BaseComponent {
  constructor(props) {
    super(props)
    if (this.constructor == FalcorController) {
      throw new TypeError("FalcorController is abstract")
    }
    // It might seem like fetching and ready are redundant
    // But you can be ready = true and fetching = true if
    // doing a refresh on data
    this.safeSetState({
      fetching: false,
      ready: false,
      data: null
    })

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
  static getFalcorPathSets(params, queryParams) {
    throw new TypeError(
      "You must implement the getFalcorPathSets method " +
      "in children of FalcorController"
    )
  }

  // Retrieves all the data for this component from the Falcor cache
  // and store on state. Used for server side render and first client side render
  // this should always contain all the data the component needs
  loadFalcorCache(falcorPathSets, callback) {
    falcorPathSets = validateFalcorPathSets(falcorPathSets);
    if (falcorPathSets === undefined) {
      this.safeSetState({
        ready: true,
        data: null
      });
      return;
    }

    const data = expandCache(this.props.model.getCache(...falcorPathSets));
    if (data) {
      this.safeSetState({
        ready: true,
        data: data
      })
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Serverside render of component: " + this.constructor.name +
          " failed. Data not in cache. Falcor Path attempted fetched was: " + JSON.stringify(falcorPathSets));
      }
      this.safeSetState({
        ready: true,
        data: null,
      });
    }
    if (callback) {
      callback(data);
    }
  }

  // Makes falcor fetch its paths
  falcorFetch(falcorPathSets, stateToSet = {}, callback) {
    falcorPathSets = validateFalcorPathSets(falcorPathSets);
    if (falcorPathSets === undefined) {
      this.safeSetState({
        ready: true,
        data: null,
      });
      if (callback) {
        callback(null);
      }
      return;
    }

    this.safeSetState({fetching: true});
    setLoading(this.uuid, true);
    const requestId = uuid();
    this.lastRequestId = requestId;
    this.props.model.get(...falcorPathSets).then((x) => {
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
          data: x.json,
        });
        this.safeSetState(stateToSet);
      }
      else {
        const err = new Error("FalcorPathSets: " + JSON.stringify(falcorPathSets) + " returned no data.")
        if (process.env.NODE_ENV !== "production") {
          console.error(err);
        }
        Object.assign(stateToSet, {
          ready: true,
          fetching: false,
          data: null,
        });
        this.safeSetState(stateToSet);
      }
      if (callback) {
        callback(x.json);
      }
    })
    .catch((e) => {
      if (process.env.NODE_ENV !== "production") {
        console.error(e);
        if (e instanceof Error) {
          console.error(e.stack);
        }
      }
    });
  }

  // This will update the values in the database through falcor
  // and update the cache accordingly
  falcorUpdate(jsonGraphEnvelope, stateToSet = {}, callback) {
    this.safeSetState({fetching: true});
    this.props.model.set(jsonGraphEnvelope).then((x) => {
      // For now we'll just fetch every time after an update
      // This would be very bad for updating views, so maybe we'll do that differently
      // but at the moment we have no good way to merge updated data especially when
      // we're deleting
      const pathSets = this.constructor.getFalcorPathSets(this.props.params, this.props.location.query)
      this.falcorFetch(pathSets, stateToSet, callback);
      // if (x) {
      //   const newData = mergeUpdatedData(this.state.data, x.json, 10)
      //   Object.assign(stateToSet, {
      //     ready: true,
      //     fetching: false,
      //     data: newData,
      //   });
      //   this.safeSetState(stateToSet);
      //   if (callback) {
      //     callback(newData);
      //   }
      // }
      // else {
      //   // No data was returned, this is exceptional behaviour from an update operation
      //   throw new Error("Falcor update on the following paths: " + JSON.stringify(jsonGraphEnvelope.paths) + " returned no data.")
      // }
    })
    .catch((e) => {
      if (process.env.NODE_ENV !== "production") {
        console.error(e);
        if (e instanceof Error) {
          console.error(e.stack);
        }
      }
      let error = null;
      if (e instanceof Error) {
        error = e;
      }
      else if (e.hasOwnProperty('0')) {
        error = e[0].value;
      }
      const errorMessage = "There was an error while updating data, please contact the developers, and we recommend refreshing the page" +
        (error !== null ? ". The error message was: " + error.message : "");
      window.alert(errorMessage);
    });
  }

  // This function lets you call one of the functions specified
  // in the Falcor Router and it will update the state of the data
  // according to what the function returns
  falcorCall(functionPath, // The path to the function in the falcor Router
             args = [], // An array of arguments to pass to the function
             refSuffixes = [], // These paths will be appended to all refs returned and fetched
             thisPaths = [], // The paths to fetch from the parent of functionPath after the function has been called
             stateToSet = {},
             callback
            ) {
    this.safeSetState({fetching: true});
    // for some reason 'call' can't handle undefined arguments
    // so we use .apply on it
    this.props.model.call(functionPath, args, refSuffixes, thisPaths).then((x) => {
      // For now we'll just fetch every time after an update
      // This would be very bad for updating views, so maybe we'll do that differently
      // but at the moment we have no good way to merge updated data especially when
      // we're deleting
      const pathSets = this.constructor.getFalcorPathSets(this.props.params, this.props.location.query)
      this.falcorFetch(pathSets, stateToSet, callback);
      // if (x) {
      //   const newData = mergeUpdatedData(this.state.data, x.json, 10);
      //   Object.assign(stateToSet, {
      //     ready: true,
      //     fetching: false,
      //     data: newData,
      //   });
      //   this.safeSetState(stateToSet);
      //   if (callback) {
      //     callback(newData);
      //   }
      // }
      // else {
      //   // No data was returned, this is exceptional behaviour from a function call
      //   throw new Error("Falcor function: " + JSON.stringify(functionPath) + " returned no data.")
      // }
    })
    .catch((e) => {
      if (process.env.NODE_ENV !== "production") {
        console.error(e);
        if (e instanceof Error) {
          console.error(e.stack);
        }
      }
      let error = null;
      if (e instanceof Error) {
        error = e;
      }
      else if (e.hasOwnProperty('0')) {
        error = e[0].value;
      }
      const errorMessage = "There was an error while updating data, please contact the developers, and we recommend refreshing the page" +
        (error !== null ? ". The error message was: " + error.message : "");
      window.alert(errorMessage);
    });
  }

  // If the new props requires a new falcor call
  // this will pick it up and refresh the falcor state
  // The falcorCallback argument will only ever be passed by an extended component
  // overwriting the function. This is so we don't have to copy the code and maintain
  // it several places
  componentWillReceiveProps(nextProps, nextContext, falcorCallback) {
    const newPathSets = this.constructor.getFalcorPathSets(nextProps.params, nextProps.location.query)
    const oldPathSets = this.constructor.getFalcorPathSets(this.props.params, this.props.location.query)
    if (!_.isEqual(oldPathSets, newPathSets)) {
      this.safeSetState({ready: false});
      if (pathSetsInCache(this.props.model.getCache(), newPathSets)) {
        this.loadFalcorCache(newPathSets, falcorCallback);
      } else {
        this.falcorFetch(newPathSets, undefined, falcorCallback)
      }
    }
  }

  // isAppReady() is always false on server, and false for first
  // render on client only. This is to avoid an immediate falcorFetch
  // on the first clientside render.
  // The falcorCallback argument will only ever be passed by an extended component
  // overwriting the function. This is so we don't have to copy the code and maintain
  // it several places
  componentWillMount(falcorCallback) {
    const falcorPathSets = this.constructor.getFalcorPathSets(this.props.params, this.props.location.query);
    if (!isAppReady() || pathSetsInCache(this.props.model.getCache(), falcorPathSets)) {
      this.loadFalcorCache(falcorPathSets, falcorCallback)
    } else {
      this.falcorFetch(falcorPathSets, undefined, falcorCallback)
    }
  }

  componentWillAppear(cb) {
    cb()
  }

  componentWillEnter(cb) {
    cb()
  }
  componentWillLeave(cb) {
    signalLeaving(cb);
  }
}
