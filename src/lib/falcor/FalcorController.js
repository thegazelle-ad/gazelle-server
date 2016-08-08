import _ from "lodash";
import { isAppReady, expandCache, pathSetsInCache, validateFalcorPathSets } from "lib/falcor/falcorUtils";
import BaseComponent from "lib/BaseComponent";
import { setLoading, signalLeaving } from "lib/loader";
import { uuid, setGlobalError, resetGlobalError, getGlobalError } from 'lib/utilities';

// Abstract class for fetching falcor objects
export default class FalcorController extends BaseComponent {
  constructor(props) {
    super(props)
    if (this.constructor == FalcorController) {
      setGlobalError(new TypeError("FalcorController is abstract"));
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
  // And hopefully it shouldn't be necessary either
  static getFalcorPathSets(params) {
    setGlobalError(new TypeError(
      "You must implement the getFalcorPathSets method " +
      "in children of FalcorController"
    ));
  }

  // Retrieves all the data for this component from the Falcor cache
  // and store on state. Used for server side render and first client side render
  // this should always contain all the data the component needs
  loadFalcorCache(falcorPathSets) {
    console.log("Loading cache");
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
      // Found on the net that console.error was deprecated, watch out for that and maybe restructure
      console.error("Serverside render of component: " + this.constructor.name +
        " failed. Data not in cache. Falcor Path attempted fetched was: " + JSON.stringify(falcorPathSets));
      this.safeSetState({
        ready: true,
        data: null
      });
    }
  }

  // Makes falcor fetch its paths
  falcorFetch(falcorPathSets) {
    falcorPathSets = validateFalcorPathSets(falcorPathSets);
    if (falcorPathSets === undefined) {
      this.safeSetState({
        ready: true,
        data: null,
      });
      return;
    }

    this.safeSetState({fetching: true, error: null});
    setLoading(this.uuid, true);
    const requestId = uuid();
    this.lastRequestId = requestId;
    this.props.model.get(...falcorPathSets).then((x) => {
      if (this.lastRequestId !== requestId) {
        // stale request, no action to response
        return;
      }

      setLoading(this.uuid, false);
      if (x) {
        this.safeSetState({
          ready: true,
          fetching: false,
          data: x.json,
        });
      }
      else {
        console.error("FalcorPathSets: " + JSON.stringify(falcorPathSets) + " returned no data.");
        this.safeSetState({
          ready: true,
          fetching: false,
          data: null,
        });
      }
      let globalError = getGlobalError();
      if (globalError && globalError.message === "Response code 0") {
        resetGlobalError();
      }
    }).catch((err) => {
      try {
        if (!(err instanceof Array)) {
          if (!(err instanceof Error)) {
            throw new Error("Unexpected Falcor Error. Caught error looks like this after JSON.stringify: " + JSON.stringify(err));
          }
          else {
            err.message = "Error comes from falcor fetch: " + err.message;
            throw err;
          }
        }
        else {
          let S = new Set();
          err.forEach((errorObject) => {
            // If falcor error object is structured in an unexpected manner throw error
            if (!((typeof errorObject === "object") && errorObject.hasOwnProperty("value")
              && (typeof errorObject.value === "object") && errorObject.value.hasOwnProperty("message")
              && (typeof errorObject.value.message === "string"))) {
              throw new Error("Unexpected Falcor Error. Unexpected object encountered while parsing error that looked like this: " + JSON.stringify(errorObject));
            }
            // Set only has unique values so won't add any message more than once
            S.add(errorObject.value.message);
          });
          if (S.size === 1) {
            let message;
            S.forEach((text) => {
              message = text;
            });
            throw new Error(message);
          }
          else if (S.size === 0) {
            throw new Error("Unexpected Falcor Error. No Error Messages parsed. Error looks like this: " + JSON.stringify(err));
          }
          else {
            let message = "Multiple falcor errors: \n";
            let cnt = 1;
            S.forEach((text) => {
              message += cnt.toString() + ". " + text;
              cnt++;
            });
            throw new Error(message);
          }
        }
      } catch (err) {
        // This catches the first error thrown and sets it as the global error
        // and local scope overrides the err variable
        setGlobalError(err);
      }
    });
  }

  // If the new props requires a new falcor call
  // this will pick it up and refresh the falcor state
  componentWillReceiveProps(nextProps) {
    const newPathSets = this.constructor.getFalcorPathSets(nextProps.params)
    const oldPathSets = this.constructor.getFalcorPathSets(this.props.params)
    if (!_.isEqual(oldPathSets, newPathSets)) {
      this.safeSetState({ready: false});
      if (pathSetsInCache(expandCache(this.props.model.getCache()), newPathSets)) {
        this.loadFalcorCache(newPathSets);
      } else {
        this.falcorFetch(newPathSets)
      }
    }
  }

  // isAppReady() is always false on server, and false for first
  // render on client only. This is to avoid an immediate falcorFetch
  // on the first clientside render
  componentWillMount() {
    const falcorPathSets = this.constructor.getFalcorPathSets(this.props.params);
    if (!isAppReady() || pathSetsInCache(expandCache(this.props.model.getCache()), falcorPathSets)) {
      this.loadFalcorCache(falcorPathSets)
    } else {
      this.falcorFetch(falcorPathSets)
    }
  }
  
  componentWillLeave(cb) {
    signalLeaving(cb);
  }
}
