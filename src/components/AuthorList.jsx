import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';

export default class AuthorList extends React.Component {
  render() {
    // Render all authors

    let renderAuthors =
      // Render nothing if this.props.authors is empty
      _.map((this.props.authors || []), function(author) {
        console.log("Author: " + author.name);
        return(
          <li key={author.slug} className="author-list__author">
            <Link to={'/author/' + author.slug}>
              {author.name}
            </Link>
          </li>
        )
      });

    return (
      <div className="author-list">
        {renderAuthors}
      </div>
    );
  }
}

AuthorList.propTypes = {
  authors: React.PropTypes.object,
}
