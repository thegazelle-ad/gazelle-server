import React from "react"
import { Link } from 'react-router'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello World!</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/counter">Counter</Link></li>
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
