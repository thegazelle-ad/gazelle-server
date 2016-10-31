import React from 'react';
import ArticleList from 'components/ArticleList';
import BaseComponent from 'lib/BaseComponent';
import { parseMarkdown } from 'lib/utilities';

export default class Author extends BaseComponent {
  render () {
    let author = this.props.author;
    return (
      <div key={author.slug} className="author">
        <div className="author__header">
          <img className="author__header__author-image" alt="author" src={author.image} />
          <div className="author__header__author-info">
            <h1 className="author__header__author-info__name">{author.name}</h1>
            <h2 className="author__header__author-info__role">{author.job_title}</h2>
            <p className="author__header__author-info__biography">{parseMarkdown(author.biography)}</p>
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
    biography: React.PropTypes.string,
    title: React.PropTypes.string,
    photo: React.PropTypes.string,
    articles: React.PropTypes.object,
  }),
}
