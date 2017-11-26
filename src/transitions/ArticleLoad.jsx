import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class ArticleLoad extends BaseComponent {
  render() {
    return (
      <div className="article-load">
        <h2 className="article__header-load"></h2>
        <div className="article__image-load"></div>
        <div className="article__body-load"></div>
      </div>
    );
  }
}
