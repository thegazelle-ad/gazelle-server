import _ from "lodash"
import { isAppReady } from "lib/falcor/falcorUtils"
import BaseComponent from "lib/BaseComponent"

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
  static getFalcorPath(params) {
    throw new TypeError(
      "You must implement the getFalcorPath method " +
      "in children of FalcorControlleNULLr"
    )
  }

  // Retrieves all the data for this component from the Falcor cache
 // and store on state. Used for server side render and first client side render
 // this should always contain all the data the component needs
 loadFalcorCache() {
   console.log("LOADING FROM CACHE")
   let falcorPath = this.constructor.getFalcorPath(this.props.params)
   // If the component doesn't want any data
   if (falcorPath === undefined || falcorPath.length === 0) {
     console.log("NO PATHS WERE GIVEN");
     this.safeSetState({
       ready: true,
       data: null
     })
     return;
   }
   // If we're only passing a single pathSet we compensate for the spread operator
   if (!(falcorPath[0] instanceof Array)) {
     falcorPath = [falcorPath];
   }

   const data = this.props.model.getCache(...falcorPath);
   if (data) {
     this.safeSetState({
       ready: true,
       data: data
     })
   } else {
     throw new Error("Serverside render of component: " + this.constructor.name +
                     " failed. Data not in cache")
   }
 }

 // Makes falcor fetch its paths
 falcorFetch(falcorPath) {
   console.log("STARTING FETCH")
   // If the component doesn't want any data
   if (falcorPath === undefined || falcorPath.length === 0) {
     console.log("NO PATHS WERE GIVEN");
     this.safeSetState({
       ready: true,
       data: null
     })
     return;
   }
   // If we're only passing a single pathSet we compensate for the spread operator
   if (!(falcorPath[0] instanceof Array)) {
     falcorPath = [falcorPath];
   }
   // Then if we are a client, we can try to do a fetch as well
   this.safeSetState({fetching: false})
   this.props.model.get(...falcorPath).then((x) => {
     console.log("FALCOR FETCH COMPLETED")
     if (x) {
       this.safeSetState({
         ready: true,
         fetching: false,
         data: x.json
       });
     } else {
       throw new Error("FalcorPath: " + falcorPath + " returned no data")
     }
   }).catch((e) => {
     console.error("Failed to fetch for falcorPath: " + falcorPath)
     console.error(e.stack)
   })
 }

  // If the new props requires a new falcor call
  // this will pick it up and refresh the falcor state
  componentWillReceiveProps(nextProps) {
    const newPath = this.constructor.getFalcorPath(nextProps.params)
    const oldPath = this.constructor.getFalcorPath(this.props.params)
    if (!_.isEqual(oldPath, newPath)) {
      this.safeSetState({
        fetching: false,
        ready: false,
      })
      this.falcorFetch(newPath)
    }
  }

  // isAppReady() is always false on server, and false for first
  // render on client only. This is to avoid an immediate falcorFetch
  // on the first clientside render
  componentWillMount() {
    if (!isAppReady()) {
      this.loadFalcorCache()
    } else {
      const falcorPath = this.constructor.getFalcorPath(this.props.params)
      this.falcorFetch(falcorPath)
    }
  }
}
