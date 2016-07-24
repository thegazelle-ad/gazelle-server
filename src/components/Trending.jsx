import React from 'react';
import ArticleList from 'components/ArticleList';

export default class Trending extends React.Component {
  render() {
    return (
      <div className="trending">
        <h2 className="trending__section-header">trending</h2>
        <ArticleList articles={this.props.articles} />
      </div>
    );
  }
}

Trending.propTypes = {
  articles: React.PropTypes.object,
}
