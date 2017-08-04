import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class TextPageLoad extends BaseComponent {
  render () {
    return (
      <div className="text-page-load">
        <h2 className="text-page__title-load"></h2>
        <div className="text-page__html-load"></div>
      </div>
    );
  }
}

