import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import _ from 'lodash';
import { Link } from 'react-router';
import moment from 'moment';

export default class Navigation extends BaseComponent {
  render() {
    const data = this.props.issueData;

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
          <p className="navigation__publication-date">{moment(data.pubDate).format('MMM DD, YYYY').toString()}</p>
          <nav role="navigation">
            <ul className="navigation__categories">
              {renderCategories}
            </ul>
          </nav>
          {/* TODO: change link to archives list */}
          <Link to="/" className="navigation__issueId">{"Issue"/* + data.issueNumber*/}</Link>
        </div>
      </div>
		);
	}
}

Navigation.propTypes = {
  appName: React.PropTypes.string,
  issueData: React.PropTypes.shape({
    pubDate: React.PropTypes.string,
    // issueNumber: React.PropTypes.string,
    categories: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
    }),
  }),
}
