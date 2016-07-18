import React from 'react';
import { Link } from 'react-router';

export default class AuthorList extends React.Component {
  render() {
    // Render all authors
    let renderAuthors = () => {
      let authors = this.props.authors;
      let data = [];
      // Return nothing if no authors listed
      if (authors){
        for (var author in authors){
          if (authors.hasOwnProperty(author)) {
            data.push(
              <div key={authors[author].slug}>
                <Link to={'/author/' + authors[author].slug}>
                  {authors[author].name}
                </Link>
              </div>
            );
          }
        }
      }
      return data;
    }

    return (
      <div>
        {renderAuthors()}
      </div>
    );
  }
}

AuthorList.propTypes = {
  authors: React.PropTypes.object,
}
