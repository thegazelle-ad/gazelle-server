import BaseComponent from "../BaseComponent"
import model from "./model"
import _ from "lodash"

// Abstract class for fetching falcor objects
export default class FalcorController extends BaseComponent {
  constructor(props) {
    super(props)
    if (this.constructor == FalcorController) {
      throw new TypeError("FalcorController is abstract")
    }
    this.state = {
      fetching: false,
      data: null
    }
  }

  // Return falcor paths as specified by:
  // http://netflix.github.io/falcor/documentation/paths.html
  // FalcorPath can depend on props only (to get server side rendering working)
  static getFalcorPath(params) {
    throw new TypeError(
      "You must implement the getFalcorPath method " +
      "in children of FalcorController"
    )
  }

  // Returns a promise of the falcor data
  // This should only be called on client side, as server side does a
  // mass fetch on results from getFalcorPath
  // It actually returns nothing, but it lets the outside function
  // know that the falcor fetch finished
  falcorFetch(falcorPath = this.constructor.getFalcorPath(this.props.params)) {
    this.safeSetState({fetching: true})
    const dataPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.props.model.get(falcorPath).then((x) => {
          this.safeSetState({
            fetching: false,
            data: x.json
          })
          resolve()
        })
      }, 2000)
    })
    
    return dataPromise
  }

  // If the new props requires a new falcor call
  // this will pick it up and make the new fetch request
  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = super.shouldComponentUpdate(nextProps, nextState)
    if (shouldUpdate) {
      const newPath = this.constructor.getFalcorPath(nextProps.params)
      const oldPath = this.constructor.getFalcorPath(this.props.params)
      if (!_.isEqual(oldPath, newPath)) {
        this.falcorFetch(newPath)
      }
    }
    return shouldUpdate
  }

  componentWillMount() {
    this.falcorFetch()
  }

  // Following are for example purposes. You must always call
  // the super for componentDidMount and componentWillUnmount
  componentDidMount() {
    super.componentDidMount()
  }

  componentWillUnmount() {
    super.componentWillUnmount()
  }
}
