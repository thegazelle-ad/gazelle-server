import React from "react"
import { Link } from 'react-router'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello World!</h1>
        <ul>
          <li><Link to="/counter">Counter</Link></li>
        </ul>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}
