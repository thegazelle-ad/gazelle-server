import React from 'react';

import AuthorList from 'components/AuthorList';

export default function Article(props) {
  return (
    <div className="article">
      <h1 className="article__title">{props.title}</h1>
      <AuthorList className="article__authors" authors={props.authors} />
      <div className="article__html" dangerouslySetInnerHTML={{__html: props.html}} />
    </div>
  );
}

Article.propTypes = {
  title: React.PropTypes.string.isRequired,
  html: React.PropTypes.string.isRequired,
  authors: React.PropTypes.object.isRequired,
}
