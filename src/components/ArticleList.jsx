// Returns a list of article previews from articles array prop
// Parents: HomePage, Author
// Children: ArticlePreview

import React from 'react';
import _ from 'lodash';
import ArticlePreview from 'components/ArticlePreview';

import { Link } from 'react-router';

// TODO: create controller component to fetch list of articles in issue
export default class ArticleList extends React.Component {
  render() {

    // Returns list of <ArticlePreview/> components with their respective posts
    let renderArticlePreviews =
      // Render nothing if this.props.articles is empty
      _.map((this.props.articles || []), function(article) {
        console.log("Article: " + article.title);
        return(
          <div key={article.slug}>
            <ArticlePreview article={article} />
          </div>
        )
      });

    return (
      <div>
        {renderArticlePreviews}
      </div>
    );
  }
}

// Formatted as list of objects
ArticleList.propTypes = {
  articles: React.PropTypes.object.isRequired,
}
