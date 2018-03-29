import React from 'react';
import ArticleList from 'components/main/ArticleList';
import BaseComponent from 'lib/BaseComponent';

export default class EditorsPicks extends BaseComponent {
  render() {
    return (
      <div className="editors-picks">
        <h2 className="section-header">
          <span>editor{"'"}s picks</span>
        </h2>
        <ArticleList articles={this.props.articles} />
      </div>
    );
  }
}

EditorsPicks.propTypes = {
  articles: ArticleList.propTypes.articles,
};
