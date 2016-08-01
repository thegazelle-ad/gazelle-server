import React from 'react';
import ArticleList from 'components/ArticleList';

export default function Author(props) {
  let author = props.author;
  return (
    <div key={author.slug} className="author">
      <h1>{author.name}</h1>
      <p>{author.biography}</p>
      <ArticleList articles={author.articles} />
    </div>
  );
}

Author.propTypes = {
  author: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    biography: React.PropTypes.string.isRequired,
    articles: React.PropTypes.object,
  }),
}
