import React from 'react';
import { Link } from 'react-router';

export default class ArticlePreview extends React.Component {

  render () {
    var article = this.props.article;
    return (
      <div>
        <img src={article.image} alt="featured" />
        // TODO: ensure ArticlePreview can handle multiple authors
        <Link to={`/author/$(article.author)`}>{article.author}</Link>
        <Link to={`/article/$(article.slug)`}>{article.title}</Link>
        <p>{article.hook}</p>
      </div>
    );
  }
}

// Validate shape of article JSON object
ArticlePreview.propTypes = {
  article: React.PropTypes.shape({
    issue: React.PropTypes.number.isRequired,
    slug: React.PropTypes.string.isRequired,
    image: React.PropType.string.isRequired,
    title: React.PropTypes.string.isRequired,
    hook: React.PropTypes.isRequired,
  }),
}
