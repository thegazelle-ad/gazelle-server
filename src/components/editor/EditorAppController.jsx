import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import { Link } from 'react-router';
import { setAppReady } from "lib/falcor/falcorUtils";

export default class EditorAppController extends BaseComponent {
  componentDidMount() {
    setAppReady();
  }

  // TODO: Make active links style a CSS class

  render() {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-1">
            <h2>Gazelle Editor Tools</h2>
            <p>Please choose whether you want to edit articles or authors</p>
            <ul>
              <li><Link to="/articles/page/1" activeClassName="active-link">Articles</Link></li>
              <li><Link to="/authors/page/1" activeClassName="active-link">Authors</Link></li>
            </ul>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
