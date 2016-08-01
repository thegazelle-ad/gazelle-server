import React from 'react';
import ArticleList from 'components/ArticleList';

export default function EditorsPicks(props) {
  return (
    <div className="editors-picks">
      <h2 className="section-header"><span>editor's picks</span></h2>
      <ArticleList articles={props.articles} />
    </div>
  );
}

EditorsPicks.propTypes = {
  articles: React.PropTypes.object,
}
