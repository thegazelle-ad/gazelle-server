import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import moment from 'moment';
import { Link } from 'react-router';

// Components
import AuthorList from 'components/AuthorList';
import ArticleList from 'components/ArticleList';
import SharingButtons from 'components/SharingButtons';
import Trending from 'components/Trending';

export default class Article extends BaseComponent {
  render () {
    return (
      <div className="article">
        <div className="article__header">
          <h1 className="article__header__title">{this.props.title}</h1>
          <div className="article__header__teaser">{this.props.teaser}</div>
          <div className="article__header__subtitle">
            <AuthorList className="article__header__subtitle__authors" authors={this.props.authors} />
            <p className="article__header__subtitle__publication-date">{moment(this.props.published_at).format('MMM DD, YYYY')}</p>
            <SharingButtons
              title={this.props.title}
              url={this.props.url}
              teaser={this.props.teaser}
            />
          </div>
        </div>
        <div className="article__body" dangerouslySetInnerHTML={{__html: this.props.html}} />
        <div className="article__body__end-mark">
          <Link to="/">
            <img src="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/header-logo.png" alt="Gazelle Logo" />
          </Link>
        </div>
        <div className="article__footer">
          <div className="article__footer__related-articles">
            <div className="article__footer__related-articles__header">
              related
            </div>
            <ArticleList articles={this.props.relatedArticles} />
          </div>
          <div className="article__footer__trending">
            <Trending articles={this.props.trending} />
          </div>
        </div>
      </div>

    );
  }
}

Article.propTypes = {
  title: React.PropTypes.string.isRequired,
  // Teaser is passed to <SharingButtons/> for use in link urls
  teaser: React.PropTypes.string.isRequired,
  html: React.PropTypes.string.isRequired,
  authors: React.PropTypes.object.isRequired,
  url: React.PropTypes.string,
  published_at: React.PropTypes.number,
  trending: React.PropTypes.object,
  relatedArticles: React.PropTypes.object,
}
