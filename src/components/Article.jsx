import React from 'react';
import BaseComponent from 'lib/BaseComponent';

import AuthorList from 'components/AuthorList';

export default class Article extends BaseComponent {
  render () {
    return (
      <div className="article">
        <h1 className="article__title">{this.props.title}</h1>
        <AuthorList className="article__authors" authors={this.props.authors} />
        <div className="article__html" dangerouslySetInnerHTML={{__html: this.props.html}} />
      </div>
    );
  }
}

Article.propTypes = {
  title: React.PropTypes.string.isRequired,
  html: React.PropTypes.string.isRequired,
  authors: React.PropTypes.object.isRequired,
}
