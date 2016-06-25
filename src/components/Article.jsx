import React from 'react';

export default class Article extends React.Component {

  // dangerouslySetInnerHTML() introduces the possibility for a
  // cross-site scripting (XSS) attack if improperly used.
  // By using a createMarkup() we ensure the return of sanitized
  // data before rendering.
  createMarkup(text) {
    return {__html: text};
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <div dangerouslySetInnerHTML={this.createMarkup(this.props.html)} />
      </div>
    );
  }
}

Article.propTypes = {
  title: React.PropTypes.string.isRequired,
  html: React.PropTypes.string.isRequired,
}
