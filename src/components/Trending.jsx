import React from 'react';
import ArticlePreview from 'components/ArticlePreview';

export default class Trending extends React.Component {
  render() {
    return (
      <div className="trending">
        trending test
      </div>
    );
  }
}

Trending.propTypes = {
  articles: React.PropTypes.object,
}
