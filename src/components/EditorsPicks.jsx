import React from 'react';
import ArticlePreview from 'components/ArticlePreview';

export default class EditorsPicks extends React.Component {
  render() {
    return (
      <div className="trending">
        editors picks test
      </div>
    );
  }
}

EditorsPicks.propTypes = {
  articles: React.PropTypes.object,
}
