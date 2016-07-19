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
          <div key={author.slug}>
            <Link to={'/author/' + author.slug}>
              {author.name}
            </Link>
          </div>
        )
      });

    return (
      <div>
        {renderAuthors}
      </div>
    );
  }
}

AuthorList.propTypes = {
  authors: React.PropTypes.object,
}
