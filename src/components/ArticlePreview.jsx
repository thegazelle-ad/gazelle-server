import React from 'react';
import SharingButtons from 'components/SharingButtons';
import { Link } from 'react-router';
import BaseComponent from 'lib/BaseComponent';

// Components
import AuthorList from 'components/AuthorList';

export default class ArticlePreview extends BaseComponent {
  render() {
    let article = this.props.article;
    let url = '/issue/' + article.issueNumber.toString() + '/' + article.category + '/' + article.slug;
    if (!article.image) { // Article image default
      article.image = 'https://thegazelle.s3.amazonaws.com/gazelle/2016/02/saadiyat-reflection.jpg';// Default featured image for articles
    }
    return (
      <div className="article-preview">
        {/*
          Featured image
          TODO: undo hardcode before release
        */}
        <Link to={'/issue/' + article.issueNumber.toString() + '/' + article.category + '/' + article.slug}>
          <img
            className="article-preview__featured-image"
            src={article.image}
            alt="featured"
          />
        </Link>
        {/*
          Article title with link to article
        */}
        <div className="article-preview__content">
          <Link to={'/category/' + article.category}>
            <p className="article-preview__content__category-header">{article.category.replace('-', ' ')}</p>
          </Link>

          <Link to={url}>
            <h3 className="article-preview__content__title">{article.title}</h3>
          </Link>
          {/* Author(s) */}
          <div className="article-preview__content__authors">
            <AuthorList authors={article.authors} />
          </div>

          {/* Article teaser */}
          <p className="article-preview__content__teaser">{article.teaser}</p>
          <SharingButtons
            title={article.title}
            url={'thegazelle.org' + url}
            teaser={article.teaser}
          />
        </div>

      </div>
    );
  }
}

// Validate shape of article JSON object
ArticlePreview.propTypes = {
  article: React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    // Teaser not used for Trending component
    teaser: React.PropTypes.string,
    issueNumber: React.PropTypes.number.isRequired,
    category: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    authors: React.PropTypes.object,
  }),
};
