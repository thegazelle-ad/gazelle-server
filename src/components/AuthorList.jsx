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
          <div key={author.slug} className="authorList__author">
            <Link to={'/author/' + author.slug}>
              {author.name}
            </Link>
          </div>
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
