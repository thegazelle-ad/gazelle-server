import React from 'react';
import ArticleList from 'components/ArticleList';
import BaseComponent from 'lib/BaseComponent';

export default class Author extends BaseComponent {
  render () {
    let author = this.props.author;
    return (
      <div key={author.slug} className="author">
        <div className="author__header">
          <img className="author__header__author-image" alt="author" src={author.photo} />
          <div className="author__header__author-info">
            <h1 className="author__header__author-info__name">{author.name}</h1>
            <h2 className="author__header__author-info__role">{author.title}</h2>
            <p className="author__header__author-info__biography">{author.biography}</p>
          </div>
        </div>
        <ArticleList articles={author.articles} />
      </div>
    );
  }
}

Author.propTypes = {
  author: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    biography: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    photo: React.PropTypes.string,
    articles: React.PropTypes.object,
  }),
}
