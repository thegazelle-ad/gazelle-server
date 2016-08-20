import _ from "lodash";
import { isAppReady, expandCache, pathSetsInCache, validateFalcorPathSets, getCache, resetCacheMemoization } from "lib/falcor/falcorUtils";
import BaseComponent from "lib/BaseComponent";
import { setLoading, signalLeaving } from "lib/loader"
import { uuid } from 'lib/utilities'

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
  // And hopefully it shouldn't be necessary either
  static getFalcorPathSets(params) {
    throw new TypeError(
      "You must implement the getFalcorPathSets method " +
      "in children of FalcorController"
    )
  }

  // Retrieves all the data for this component from the Falcor cache
  // and store on state. Used for server side render and first client side render
  // this should always contain all the data the component needs
  loadFalcorCache(falcorPathSets) {
    falcorPathSets = validateFalcorPathSets(falcorPathSets);
    if (falcorPathSets === undefined) {
      this.safeSetState({
        ready: true,
        data: null
      });
      return;
    }

    // The true flag is the expandCache flag so the refs are expanded
    const data = getCache(this.props.model, falcorPathSets, true);
    if (data) {
      this.safeSetState({
        ready: true,
        data: data
      })
    } else {
      // Found on the net that console.error was deprecated, watch out for that and maybe restructure
      const err = new Error("Serverside render of component: " + this.constructor.name +
        " failed. Data not in cache. Falcor Path attempted fetched was: " + JSON.stringify(falcorPathSets));
      console.error(err);
      this.safeSetState({
        ready: true,
        data: null,
        error: err
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
      resetCacheMemoization();
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
        const err = new Error("FalcorPathSets: " + JSON.stringify(falcorPathSets) + " returned no data.")
        console.error(err);
        this.safeSetState({
          ready: true,
          fetching: false,
          data: null,
          error: err,
        });
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
      if (pathSetsInCache(this.props.model, newPathSets)) {
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
    if (!isAppReady() || pathSetsInCache(this.props.model, falcorPathSets)) {
      this.loadFalcorCache(falcorPathSets)
    } else {
      this.falcorFetch(falcorPathSets)
    }
  }

  componentWillLeave(cb) {
    signalLeaving(cb);
  }
}
