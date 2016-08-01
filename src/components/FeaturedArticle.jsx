import React from 'react';
import ArticlePreview from 'components/ArticlePreview';

export default function FeaturedArticle(props) {
  return (
    <div className="featured-article">
      <ArticlePreview article={props.article} />
    </div>
  );
}

FeaturedArticle.propTypes = {
  article: React.PropTypes.object,
}
