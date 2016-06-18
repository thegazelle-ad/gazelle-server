import React from 'react';
import { Link } from 'react-router';

export default class ArticlePreview extends React.Component {

  loadPost(e) {
    e.preventDefault();
    // LOAD_ARTICLE action
  }

  render () {
    var article = this.props.article;
    return (
      <div>
        <img src={article.image} alt="featured" />
        // TODO: ensure ArticlePreview can handle multiple authors
        <Link to={`/$(article.author)`}>{article.author}</Link>
        <Link to={`/$(article.issue)/$(article.slug)`}>{article.title}</Link>
      </div>
    );
  }
}

// Validate shape of JSON object
ArticlePreview.propTypes = {
  article: React.PropTypes.shape({
    issue: React.PropTypes.number.isRequired,
    slug: React.PropTypes.string.isRequired,
    image: React.PropType.string.isRequired,
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.isRequired,
  }),
}
