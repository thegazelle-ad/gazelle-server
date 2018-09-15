import ArticleBody from 'components/main/ArticleBody';
import React from 'react';

const ArticlePreview = props => (
  <div className="article">
    <ArticleBody {...props} />
  </div>
);

ArticlePreview.propTypes = ArticleBody.propTypes;

export default ArticlePreview;
