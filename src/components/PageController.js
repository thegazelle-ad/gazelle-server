import React from "react"
import FalcorController from "../lib/falcor/FalcorController"
import model from "../lib/falcor/model"

export default class PageController extends FalcorController {
  static getFalcorPath(params) {
    return ['pages', params.id, "body"]
  }

  render() {
    return (
      <div>
        <h2>Welcome to page: {this.props.params.id}</h2>
        <span>Ready: + {this.state.dataReady ? "true" : "false"}</span>
      </div>
    )
  }
}
