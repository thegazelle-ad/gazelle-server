import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import moment from 'moment';
import { Link } from 'react-router';
import _ from 'lodash';

// Components
import AuthorList from 'components/main/AuthorList';
import SharingButtons from 'components/main/SharingButtons';

export default class ArticleBody extends BaseComponent {
  render() {
    return (
      <div>
        <div className="article__header">
          <h1 className="article__header__title">{this.props.title}</h1>
          <div className="article__header__teaser">{this.props.teaser}</div>
          <div className="article__header__subtitle">
            <AuthorList
              className="article__header__subtitle__authors"
              authors={_.toArray(this.props.authors)}
            />
            <p className="article__header__subtitle__publication-date">
              {moment(this.props.published_at).format('MMM DD, YYYY')}
            </p>
            <SharingButtons
              title={this.props.title}
              url={this.props.url}
              teaser={this.props.teaser}
            />
          </div>
        </div>
        <div
          className="article__body"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: this.props.html }}
        />
        <div className="article__body__end-mark">
          <Link to="/">
            <img
              src="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/header-logo.png"
              alt="Gazelle Logo"
            />
          </Link>
        </div>
      </div>
    );
  }
}

ArticleBody.propTypes = {
  title: React.PropTypes.string.isRequired,
  // Teaser is passed to <SharingButtons/> for use in link urls
  teaser: React.PropTypes.string,
  html: React.PropTypes.string.isRequired,
  authors: AuthorList.propTypes.authors,
  url: React.PropTypes.string,
  published_at: React.PropTypes.number,
};
