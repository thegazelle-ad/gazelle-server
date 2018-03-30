import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class TextPageLoad extends BaseComponent {
  render() {
    return (
      <div className="text-page-load">
        <div className="text-page__title-load" />
        <div className="text-page__html-load" />
      </div>
    );
  }
}
