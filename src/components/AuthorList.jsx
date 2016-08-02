import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';

export default function AuthorList(props) {
  // Render all authors
  let renderAuthors =
    // Render nothing if props.authors is empty
    _.map((props.authors || []), (author) => {
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

AuthorList.propTypes = {
  authors: React.PropTypes.object,
}
