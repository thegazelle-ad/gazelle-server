import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import _ from 'lodash';
import { Link } from 'react-router';
import moment from 'moment';

export default class Navigation extends BaseComponent {
  render() {
    if (this.props.navigationData != null) { // Wait for navigation data to come in asynchronous
      const data = this.props.navigationData;
      // Renders only categories that exist in the issue as passed through
      // the 'categories' prop
      let renderCategories =
        _.map((data.categories || []), function(category) {
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
            <p className="navigation__publication-date">{moment(data.published_at).format('MMM DD, YYYY').toString()}</p>
            <nav role="navigation">
              <ul className="navigation__categories">
                {renderCategories}
              </ul>
            </nav>
            {/* TODO: change link to archives list */}
            <Link to="/" className="navigation__issueNumber">{"Issue " + data.issueNumber}</Link>
          </div>
        </div>
      );
    } else {
      return (
        <div>

        </div>
      );
    }
	}
}

Navigation.propTypes = {
  navigationData: React.PropTypes.shape({
    published_at: React.PropTypes.number,
    issueNumber: React.PropTypes.number,
    categories: React.PropTypes.object,
  }),
}
