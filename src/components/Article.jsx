import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import moment from 'moment';

import AuthorList from 'components/AuthorList';
import SharingButtons from 'components/SharingButtons';

export default class Article extends BaseComponent {
  render () {
    return (
      <div className="article">
        <div className="article__header">
          <h1 className="article__header__title">{this.props.title}</h1>
          <div className="article__header__teaser">{this.props.teaser}</div>
          <div className="article__header__subtitle">
            <AuthorList className="article__header__subtitle__authors" authors={this.props.authors} />
            <p className="article__header__subtitle__publication-date">{moment(this.props.pubDate).format('MMM DD, YYYY')}</p>
            <SharingButtons
              title={this.props.title}
              url={this.props.url}
              teaser={this.props.teaser}
            />
          </div>
        </div>
        <div className="article__body" dangerouslySetInnerHTML={{__html: this.props.html}} />
        <div className="article__footer">

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
  pubDate: React.PropTypes.string,
}
