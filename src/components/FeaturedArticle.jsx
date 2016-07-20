import React from 'react';
import ArticlePreview from 'components/ArticlePreview';

export default class FeaturedArticle extends React.Component {
  render() {
    return (
      <div className="featured-article">
        <ArticlePreview article={this.props.article} />
      </div>
    );
  }
}

FeaturedArticle.propTypes = {
  article: React.PropTypes.object,
}
