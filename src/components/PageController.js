import React from "react"
import FalcorController from "../lib/falcor/FalcorController"
import model from "../lib/falcor/model"

export default class PageController extends FalcorController {
  static getFalcorPath(params) {
    return ['pages', parseInt(params.id), "body"]
  }

  render() {
    console.log("RENDER")
    console.log(this.state)
    return (
      <div>
        <h2>Welcome to page: {this.props.params.id}</h2>
        <div>Ready: {this.state.data ? "true" : "false"}</div>
        <div>Fetching: {this.state.fetching ? "true" : "false"}</div>
        <div>
          Hello there
          {this.state.data}
          {this.state.fetching}
        </div>
      </div>
    )
  }
}
