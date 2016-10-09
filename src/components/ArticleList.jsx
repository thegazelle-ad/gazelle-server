// Returns a list of article previews from articles array prop
// Parents: HomePage, Author
// Children: ArticlePreview

import React from 'react';
import _ from 'lodash';

import BaseComponent from 'lib/BaseComponent';

// Components
import ArticlePreview from 'components/ArticlePreview';

// TODO: create controller component to fetch list of articles in issue
export default class ArticleList extends BaseComponent {
  render () {
    // Returns list of <ArticlePreview/> components with their respective posts
    let renderArticlePreviews =
      // Render nothing if this.props.articles is empty
      _.map((this.props.articles || []), (article) => {
        //console.log("Article: " + article.title);
        return(
          <ArticlePreview key={article.slug} article={article} />
        )
      });

    return (
      <div className="article-list">
        {renderArticlePreviews}
      </div>
    );
  }
}

// Formatted as list of objects
ArticleList.propTypes = {
  articles: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
  ]).isRequired,
}
