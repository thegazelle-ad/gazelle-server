import React from 'react';
import BaseComponent from 'lib/BaseComponent';

// Components
import AuthorList from 'components/main/AuthorList';
import ArticleList from 'components/main/ArticleList';
import Trending from 'components/main/Trending';
import ArticleBody from 'components/main/ArticleBody';

export default class Article extends BaseComponent {
  render() {
    return (
      <div className="article">
        <ArticleBody {...this.props} />
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
  teaser: React.PropTypes.string,
  html: React.PropTypes.string.isRequired,
  authors: AuthorList.propTypes.authors,
  url: React.PropTypes.string,
  published_at: React.PropTypes.number,
  trending: Trending.propTypes.articles,
  relatedArticles: ArticleList.propTypes.articles,
};
