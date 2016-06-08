import React from "react"
import BaseComponent from "../lib/BaseComponent.js"

export default class Page extends BaseComponent {
  render() {
    return (
      <div>
        <div>
          {this.props.title}
        </div>
        <div>
          {this.props.body}
        </div>
      </div>
    )
  }
}
