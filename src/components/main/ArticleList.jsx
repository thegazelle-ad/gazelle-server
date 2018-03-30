// Returns a list of article previews from articles array prop
// Parents: HomePage, Author
// Children: ArticlePreview

import React from 'react';

import BaseComponent from 'lib/BaseComponent';

// Components
import ArticlePreview from 'components/main/ArticlePreview';

// TODO: create controller component to fetch list of articles in issue
export default class ArticleList extends BaseComponent {
  render() {
    // Returns list of <ArticlePreview/> components with their respective posts
    const renderArticlePreviews =
      // Render nothing if this.props.articles is empty
      this.props.articles.map(article => (
        <ArticlePreview key={article.slug} article={article} />
      ));

    return <div className="article-list">{renderArticlePreviews}</div>;
  }
}

// Formatted as list of objects
ArticleList.propTypes = {
  articles: React.PropTypes.arrayOf(ArticlePreview.propTypes.article)
    .isRequired,
};

ArticleList.defaultProps = {
  articles: [],
};
