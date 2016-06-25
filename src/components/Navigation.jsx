import React from 'react';
import { Link } from 'react-router';

export default class Navigation extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.appName}</h1>
        {/* Add list item by categories that exist in issue x */}
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/issue/55/opinion/palestine-hamilton">Sample Article</Link></li>
          <li><Link to="/author/ahmed-meshref">Sample Author</Link></li>
        </ul>
      </div>
    )
  }
}
