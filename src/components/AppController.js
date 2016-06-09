import React from "react"
import FalcorController from "../lib/falcor/FalcorController"
import { setAppReady } from "../lib/falcor/falcorUtils.js"
import { Link } from "react-router"

export default class AppController extends FalcorController {
  static getFalcorPath(params) {
    return ['appName']
  }

  componentDidMount() {
    super.componentDidMount()
    setAppReady()
  }

  render() {
    return (
      <div>
        <h1>{this.state.data.appName}</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/page/0">Page 0</Link></li>
          <li><Link to="/page/1">Page 1</Link></li>
          <li><Link to="/page/2">Page 2</Link></li>
        </ul>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}
