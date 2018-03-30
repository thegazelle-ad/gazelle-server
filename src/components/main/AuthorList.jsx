import React from 'react';
import { Link } from 'react-router';
import BaseComponent from 'lib/BaseComponent';

export default class AuthorList extends BaseComponent {
  render() {
    // Render all authors
    const renderAuthors =
      // Render nothing if props.authors is empty
      this.props.authors.map(author => (
        <li key={author.slug} className="author-list__author">
          <Link to={`/author/${author.slug}`}>{author.name}</Link>
        </li>
      ));

    return <div className="author-list">{renderAuthors}</div>;
  }
}

AuthorList.propTypes = {
  authors: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
    }),
  ).isRequired,
};

AuthorList.defaultProps = {
  authors: [],
};
