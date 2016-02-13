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
    this.unmounted = false;
  }

  // Return falcor paths as specified by:
  // http://netflix.github.io/falcor/documentation/paths.html
  getFalcorPath() {
    throw new TypeError(
      "You must implement the getFalcorPath method " +
      "in children of FalcorController"
    )
  }

  falcorFetch(falcorPath) {
    this.safeSetState({dataReady: false})

    setTimeout(() => {
      model.get(falcorPath).then((x) => {
        this.safeSetState({
          dataReady: true,
          data: x.json
        })
      })
    }, 2000)
  }

  // If the new props / state requires a new falcor call
  // this will pick it up and make the new fetch request
  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = super.shouldComponentUpdate(nextProps, nextState)
    if (shouldUpdate) {
      const newPath = this.getFalcorPath(nextProps, nextState)
      const oldPath = this.getFalcorPath(this.props, this.state)
      if (!_.isEqual(oldPath, newPath)) {
        this.falcorFetch(newPath)
      }
    }
    return shouldUpdate
  }

  componentWillMount() {
    this.falcorFetch(this.getFalcorPath(this.props, this.state))
  }

  // Following are for example purposes. You must always call
  // the super for componentDidMount and componentWillUnmount
  componentDidMount() {
    super.componentDidMount()
  }

  componentWillUnmount() {
    this.mounted = false
  }
}
