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
          <li key={category} className="navigation__item">
            <Link to={"/category/"+category}>{category}</Link>
          </li>
        )
      });

    return (
      <div className="header">
        <h1><Link to="/">{this.props.appName}</Link></h1>
        <ul className="navigation">
          {renderCategories}
        </ul>
      </div>
    )
  }
}

Navigation.propTypes = {
  appName: React.PropTypes.string,
}
