import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class TextPage extends BaseComponent {
  render() {
    return (
      <div className="text-page">
        <h2 className="text-page__title">{this.props.title}</h2>
        <div
          className="text-page__html"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: this.props.html }}
        />
      </div>
    );
  }
}

TextPage.propTypes = {
  title: React.PropTypes.string,
  html: React.PropTypes.string,
};
