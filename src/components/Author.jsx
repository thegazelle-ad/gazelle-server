import React from 'react';
import ArticleList from 'components/ArticleList';
import BaseComponent from 'lib/BaseComponent';

export default class Author extends BaseComponent {
  render () {
    let author = this.props.author;
    return (
      <div key={author.slug} className="author">
        <h1>{author.name}</h1>
        <p>{author.biography}</p>
        <ArticleList articles={author.articles} />
      </div>
    );
  }
}

Author.propTypes = {
  author: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    biography: React.PropTypes.string.isRequired,
    articles: React.PropTypes.object,
  }),
}
