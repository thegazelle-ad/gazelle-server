import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import BaseComponent from 'lib/BaseComponent';

export default class Navigation extends BaseComponent {
  render() {
    // Render all categories in nav bar
    let categories = ["off-campus", "on-campus", "commentary", "creative", "in-focus"];
    let renderCategories =
      _.map((categories || []), function(category) {
        return(
          <li key={category} className="navigation__categories__item">
            <Link to={"/category/"+category} activeClassName="navigation__categories__item--active">
              {category}
            </Link>
          </li>
        )
      });

    return (
      <div>
        <div className="header">
          <div className="header__search">
            <input
              className="header__search__main"
              type="text"
              placeholder="Search The Gazelle"
            />
            <div className="header__search__tail" />
            <div className="header__search__text">SEARCH</div>
          </div>
          <div className="header__title">
            <Link to="/" className="header__title--content">{this.props.appName}</Link>
          </div>
          {/* TODO: change link to archives list */}
          <Link to="/" className="header__issueId">{"Issue 55"}</Link>
        </div>
        <div className="navigation">
          <p className="navigation__publication-date">Aug. 15, 2016</p>
          <ul className="navigation__categories">
            {renderCategories}
          </ul>
          <p className="navigation__weather">35&deg;</p>
        </div>
        {/* TODO: change link to archives list */}
        <Link to="/" className="header__issueId">{"Issue 55"}</Link>
      </div>
      <div className="navigation">
        <p className="navigation__publication-date">Aug. 15, 2016</p>
        <ul className="navigation__categories">
          {renderCategories}
        </ul>
        <p className="navigation__weather">35&deg;</p>
      </div>
    );
  }
}

Navigation.propTypes = {
  appName: React.PropTypes.string,
}
