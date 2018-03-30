import React from 'react';
import ArticlePreview from 'components/main/ArticlePreview';
import BaseComponent from 'lib/BaseComponent';

export default class FeaturedArticle extends BaseComponent {
  render() {
    return (
      <div className="featured-article">
        <ArticlePreview article={this.props.article} />
      </div>
    );
  }
}

FeaturedArticle.propTypes = {
  article: ArticlePreview.propTypes.article,
};
