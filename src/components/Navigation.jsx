import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';

export default class Navigation extends React.Component {

  render() {

    // Render all categories in nav bar
    let categories = ["opinion", "features", "news"];
    let renderCategories =
      _.map((categories || []), function(category) {
        return(
          <li key={category}>
            <Link to={"/category/"+category}>{category}</Link>
          </li>
        )
      });

    return (
      <div>
        <h1>{this.props.appName}</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          {renderCategories}
        </ul>
      </div>
    )
  }
}

Navigation.propTypes = {
  appName: React.PropTypes.string,
}
