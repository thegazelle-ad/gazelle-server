import React from 'react';

export default class TextPage extends React.Component {
  render() {
    return (
      <div className="text-page">
        <h2 className="text-page__title">{this.props.title}</h2>
        <div className="text-page__html" dangerouslySetInnerHTML={{__html: this.props.html}} />
      </div>
    );
  }
}

TextPage.propTypes = {
  title: React.PropTypes.string,
  content: React.PropTypes.string,
}
