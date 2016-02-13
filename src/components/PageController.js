import React from "react"
import FalcorController from "../lib/falcor/FalcorController"

export default class PageController extends FalcorController {
  render() {
    return (
      <div>
        <h2>Welcome to page: {this.props.params.id}</h2>
      </div>
    )
  }
}
