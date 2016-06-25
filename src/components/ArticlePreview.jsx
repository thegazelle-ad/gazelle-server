import React from 'react';
import { Link } from 'react-router';

export default class ArticlePreview extends React.Component {

  render () {
    var article = this.props.article;

    // TODO: ensure ArticlePreview can handle multiple authors
    // TODO: edit link routing and remove /0/
    return (
      <div>
        <div>
          <img src={article.image} alt="featured" />
        </div>
        <div>
          <Link to={'/author/0/' + article.author}>
            {article.author}
          </Link>
        </div>
        <div>
          <Link to={'/article/' + article.id + '/' + article.slug}>
            {article.title}
          </Link>
        </div>
        <div>
          <p>{article.hook}</p>
        </div>
      </div>
    );
  }
}

// Validate shape of article JSON object
ArticlePreview.propTypes = {
  article: React.PropTypes.shape({
    issue: React.PropTypes.number.isRequired,
    slug: React.PropTypes.string.isRequired,
    id: React.PropTypes.number.isRequired,
    image: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    hook: React.PropTypes.isRequired,
  }),
}
