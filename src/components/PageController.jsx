import React from "react"
import FalcorController from "FalcorController"
import Page from "Page"

export default class PageController extends FalcorController {
  static getFalcorPath(params) {
    return ['pages', parseInt(params.id), ["title", "body"]]
  }

  render() {
    const articleData = this.state.data.pages[parseInt(this.props.params.id)]
    return (
      <div>
        <h2>Controller for page: {this.props.params.id}</h2>
        <div>Ready: {this.state.data ? "true" : "false"}</div>
        <div>Fetching: {this.state.fetching ? "true" : "false"}</div>
        <Page title={articleData.title} body={articleData.body} />
      </div>
    )
  }
}
