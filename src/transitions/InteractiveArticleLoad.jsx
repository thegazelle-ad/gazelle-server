import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class InteractiveArticleLoad extends BaseComponent {
  render() {
    return (
      <div className="interactive-article-load">
        <h2 className="interactive-article-load__title"></h2>
        <div className="interactive-article-load__html"></div>
      </div>
    );
  }
}
