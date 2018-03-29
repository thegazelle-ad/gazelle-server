import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class InteractiveArticleLoad extends BaseComponent {
  render() {
    return (
      <div className="interactive-article-load">
        <div className="interactive-article-load__title" />
        <div className="interactive-article-load__html" />
      </div>
    );
  }
}
