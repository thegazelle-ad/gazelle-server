import React from 'react';
import { Link } from 'react-router';

import AuthorList from 'components/AuthorList';

export default class Article extends React.Component {
  render() {
    
    return (
      <div>
        <h1>{this.props.title}</h1>
        <AuthorList authors={this.props.authors} />
        <div dangerouslySetInnerHTML={{__html: this.props.html}} />
      </div>
    );
  }
}

Article.propTypes = {
  title: React.PropTypes.string.isRequired,
  html: React.PropTypes.string.isRequired,
  authors: React.PropTypes.object.isRequired,
}
