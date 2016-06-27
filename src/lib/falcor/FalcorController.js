import _ from "lodash";
import { isAppReady, expandCache } from "lib/falcor/falcorUtils";
import BaseComponent from "lib/BaseComponent";

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
  }

  // Return falcor paths as specified by:
  // http://netflix.github.io/falcor/documentation/paths.html
  // FalcorPath can depend on props only (to get server side rendering working)
  static getFalcorPathSets(params) {
    throw new TypeError(
      "You must implement the getFalcorPathSets method " +
      "in children of FalcorControlleNULLr"
    )
  }

  validateFalcorPathSets(falcorPathSets) {
    // If the component doesn't want any data
    if (!falcorPathSets || !(falcorPathSets instanceof Array) || falcorPathSets.length === 0) {
      console.log("NO PATHS WERE GIVEN");
      this.safeSetState({
        ready: true,
        data: null
      })
      return undefined;
    }
    // If we're only passing a single pathSet we compensate for the spread operator
    if (!(falcorPathSets[0] instanceof Array)) {
      return [falcorPathSets];
    }
    return falcorPathSets;
  }

  // Retrieves all the data for this component from the Falcor cache
  // and store on state. Used for server side render and first client side render
  // this should always contain all the data the component needs
  loadFalcorCache(falcorPathSets) {
    console.log("LOADING FROM CACHE")

    falcorPathSets = this.validateFalcorPathSets(falcorPathSets);
    if (falcorPathSets === undefined) return;
    
    const data = expandCache(this.props.model.getCache(...falcorPathSets));
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
    console.log("STARTING FETCH")

    falcorPathSets = this.validateFalcorPathSets(falcorPathSets);
    if (falcorPathSets === undefined) return;

    // Then if we are a client, we can try to do a fetch as well
    this.safeSetState({fetching: true});
    this.props.model.get(...falcorPathSets).then((x) => {
      console.log("FALCOR FETCH COMPLETED")
      if (x) {
        this.safeSetState({
          ready: true,
          fetching: false,
          data: x.json
        });
      }
      else {
        const err = new Error("FalcorPathSets: " + JSON.stringify(falcorPathSets) + " returned no data.")
        console.error(err);
        this.safeSetState({
          ready: true,
          fetching: false,
          data: null,
          error: err
        });
      }
    });
  }

  // If the new props requires a new falcor call
  // this will pick it up and refresh the falcor state
  componentWillReceiveProps(nextProps) {
    const newPath = this.constructor.getFalcorPathSets(nextProps.params)
    const oldPath = this.constructor.getFalcorPathSets(this.props.params)
    if (!_.isEqual(oldPath, newPath)) {
      this.safeSetState({ready: false});
      this.falcorFetch(newPath)
    }
  }

  // isAppReady() is always false on server, and false for first
  // render on client only. This is to avoid an immediate falcorFetch
  // on the first clientside render
  componentWillMount() {
    const falcorPathSets = this.constructor.getFalcorPathSets(this.props.params)
    if (!isAppReady()) {
      this.loadFalcorCache(falcorPathSets)
    } else {
      this.falcorFetch(falcorPathSets)
    }
  }
}
