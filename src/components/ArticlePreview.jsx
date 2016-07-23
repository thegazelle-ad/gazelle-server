import React from 'react';
import AuthorList from 'components/AuthorList';
//import image from '../static/sample-issue/images/articles/palestine-hamilton.jpg';

import { Link } from 'react-router';

export default class ArticlePreview extends React.Component {

  render () {
    let article = this.props.article;
    return (
      <div className="article-preview">
        {/*
          Featured image
          TODO: undo hardcode before release
        */}
        <img
          className="article-preview__featured-image"
          src={"http://thegazelle.s3.amazonaws.com/gazelle/2016/02/saadiyat-reflection.jpg "}
          alt="featured"
        />

        {/*
          Article title with link to article
        */}
        <div className="article-preview__content">
          <Link to={'/issue/' + article.issueId + '/' + article.category + '/' + article.slug}>
            <h3 className="article-preview__content__title">{article.title}</h3>
          </Link>

          {/* Author(s) */}
          <div className="article-preview__content__authors">
            <AuthorList authors={article.authors} />
          </div>

          {/* Article teaser */}
          <p className="article-preview__content__teaser">{article.teaser}</p>
        </div>
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
