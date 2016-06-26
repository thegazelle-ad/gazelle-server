import React from 'react';
import { Link } from 'react-router';

export default class Navigation extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.appName}</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/article/0/palestine-hamilton">Article</Link></li>
          <li><Link to="/issue/55/opinion/palestine-hamilton">New Article</Link></li>
          <li><Link to="/author/ahmed-meshref">New Author</Link></li>
        </ul>
      </div>
    )
  }
}
