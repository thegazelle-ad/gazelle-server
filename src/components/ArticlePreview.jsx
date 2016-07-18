import React from 'react';
import AuthorList from 'components/AuthorList';

import { Link } from 'react-router';

export default class ArticlePreview extends React.Component {

  render () {
    let article = this.props.article;
    return (
      <div>
        {/*
          Featured image
          TODO: change article image path before release
          <img src={article.image} alt="featured" />
        */}

        {/*
          Article title with link to article
        */}
        <Link to={'/issue/' + article.issueId + '/' + article.category + '/' + article.slug}>
          {article.title}
        </Link>

        {/* Author(s) */}
        <AuthorList authors={article.authors} />

        {/* Article teaser */}
        <p>{article.teaser}</p>
      </div>
    );
  }
}

// Validate shape of article JSON object
ArticlePreview.propTypes = {
  article: React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    teaser: React.PropTypes.string.isRequired,
    issueId: React.PropTypes.string.isRequired,
    category: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    authors: React.PropTypes.object,
  }),
}
