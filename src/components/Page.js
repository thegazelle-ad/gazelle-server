import React from "react"
import { Link } from 'react-router'

export default class Page extends React.Component {
  render() {
    return (
      <div>
        <h2>Welcome to page: {this.props.params.id}</h2>
      </div>
    )
  }
}
