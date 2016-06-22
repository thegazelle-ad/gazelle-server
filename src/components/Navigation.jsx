import React from 'react';
import { Link } from 'react-router';

export default class Navigation extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.appName}</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/page/0">Page 0</Link></li>
          <li><Link to="/page/1">Page 1</Link></li>
          <li><Link to="/page/2">Page 2</Link></li>
          <li><Link to="/article/0">Article 1</Link></li>
        </ul>
      </div>
    )
  }
}
