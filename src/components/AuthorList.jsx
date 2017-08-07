import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import BaseComponent from 'lib/BaseComponent';

export default class AuthorList extends BaseComponent {
  render() {
    // Render all authors
    let renderAuthors = (
      // Render nothing if props.authors is empty
      _.map((this.props.authors || []), author => (
        <li key={author.slug} className="author-list__author">
          <Link to={`/author/ ${author.slug}`}>
            {author.name}
          </Link>
        </li>
      ))
    );

    return (
      <div className="author-list">
        {renderAuthors}
      </div>
    );
  }
}

AuthorList.propTypes = {
  authors: React.PropTypes.object,
};
