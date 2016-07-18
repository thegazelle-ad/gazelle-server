import React from 'react';
import ArticleList from 'components/ArticleList';

export default class Author extends React.Component {
    // TODO: establish static JSON object for authors
    // structure: {name, photo, biography, articleKeys=[]}


    // TODO: establish static JSON object for authors
    // structure: {name, photo, biography, articleKeys=[]}
  render() {
    let author = this.props.author;
    return (
      <div key={author.slug}>
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
