import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';

export default class Navigation extends React.Component {

  render() {

    // Render all categories in nav bar
    let categories = ["off-campus", "on-campus", "commentary", "creative", "in-focus"];
    let renderCategories =
      _.map((categories || []), function(category) {
        return(
          <li key={category} className="navigation__item">
            <Link to={"/category/"+category} activeClassName="navigation__item--active">
              {category}
            </Link>
          </li>
        )
      });

    return (
      <div>
        <div className="header__title">
          <Link to="/">{this.props.appName}</Link>
        </div>
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
