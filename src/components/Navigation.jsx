import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import _ from 'lodash';
import { Link } from 'react-router';
import moment from 'moment';

export default class Navigation extends BaseComponent {
  render() {
    // Render all categories in nav bar
    let categories = [
      {
        name: "off campus",
        slug: "off-campus",
      },
      {
        name: "on campus",
        slug: "on-campus",
      },
      {
        name: "commentary",
        slug: "commentary",
      },
      // { // Removed for first hardcoded issue
      //   name: "creative",
      //   slug: "creative",
      // },
      {
        name: "in focus",
        slug: "in-focus",
      },
    ];
    let renderCategories =
      _.map((categories || []), function(category) {
        return(
          <li
            key={category.slug}
            className="navigation__categories__item"
          >
            <Link to={"/category/"+category.slug} activeClassName="navigation__categories__item--active">
              {category.name}
            </Link>
          </li>
        )
      });

    return (
      <div>
        <div className="navigation">
          <p className="navigation__publication-date">{moment("2016-09-04T05:58:09.000Z").format('MMM DD, YYYY').toString()}</p>
          <nav role="navigation">
            <ul className="navigation__categories">
              {renderCategories}
            </ul>
          </nav>
          {/* TODO: change link to archives list */}
          <Link to="/" className="navigation__issueId">{"Issue 90"}</Link>
        </div>
      </div>
		);
	}
}

Navigation.propTypes = {
  appName: React.PropTypes.string,
}
