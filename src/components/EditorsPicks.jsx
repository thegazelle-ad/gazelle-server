import React from 'react';
import ArticleList from 'components/ArticleList';

export default class EditorsPicks extends React.Component {
  render() {
    return (
      <div className="editors-picks">
        <h2 className="section-header"><span>editor's picks</span></h2>
        <ArticleList articles={this.props.articles} />
      </div>
    );
  }
}

EditorsPicks.propTypes = {
  articles: React.PropTypes.object,
}
