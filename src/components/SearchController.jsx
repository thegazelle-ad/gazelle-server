import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { browserHistory } from 'react-router';
import _ from 'lodash';

// Components
import ArticleList from 'components/ArticleList';

export default class SearchController extends FalcorController {
  static getFalcorPathSets(params, queryParams) {
    // If you just went straight to the search page
    if (!queryParams.q) {
      return [];
    }
    return [
      ["search", "posts", queryParams.q, {length: 20}, ["title", "teaser", "issueNumber", "category", "slug", "image", 'published_at']],
      ["search", "posts", queryParams.q, {length: 20}, "authors", {length: 10}, ["name", "slug"]],
    ];
  }

  // Allows user to navigate to populated search page on pressing 'Enter'
  handleSubmit (e) {
    e.preventDefault();
    browserHistory.push('/search?q=' + e.target.search.value);
  }

  render() {
    // Render no results found message, empty results or list of found articles
    let renderContent = () => {
      if (!this.props.location.query.q) {
        return null;
      }
      if (!this.state.data) {
        return (
          <div className="search__no-data">
            Oops! No Results found. <br />
            Please try another query.
          </div>
        )
      }
      else {
        const query = this.props.location.query.q;
        const results = _.filter(this.state.data.search.posts[query], (article) => {
          return article.published_at;
        });
        return <ArticleList className="search" articles={results} />
      }
    }
    if (this.state.ready) {
      const query = this.props.location.query.q || "";
      return (
        <div className="search">
          <div className="search__search-header">
            <h2 className="search__search-header__text" >Search: </h2>
            <form onSubmit={this.handleSubmit}>
              <input
                className="search__search-header__search-box"
                type="text"
                name="search"
                defaultValue={query}
                autoFocus
              />
            </form>
          </div>
          {renderContent()}
        </div>
      );
    }
    return <div>Loading</div>;
  }
}
