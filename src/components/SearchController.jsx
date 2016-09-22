import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { browserHistory } from 'react-router';

// Components
import ArticleList from 'components/ArticleList';
import NotFound from 'components/NotFound';

export default class SearchController extends FalcorController {
  static getFalcorPathSets(params, queryParams) {
    return [
      ["search", "posts", queryParams.q, {length: 20}, ["title", "teaser", "issueNumber", "category", "slug", "image"]],
      ["search", "posts", queryParams.q, {length: 20}, "authors", {length: 10}, ["name", "slug"]],
    ];
  }

  // Allows user to navigate to populated search page on pressing 'Enter'
  handleKeyPress (e) {
    if (e.nativeEvent.key == 'Enter'){ // Enter pressed
      browserHistory.push('/search?q=' + e.target.value);
    }
  }

  render() {
    if (this.state.ready) {
      if (!this.props.location.query.q) {
        return <NotFound />
      }
      if (!this.state.data) {
        return <div className="search__no-data">No Results. Please try another query.</div>;
      }
      const query = this.props.location.query.q;
      const results = this.state.data.search.posts[query];
      return (
        <div className="search">
          <div className="search__search-header">
            <h2 className="search__search-header__text" >Search: </h2>
            <input
              className="search__search-header__search-box"
              type="text"
              defaultValue={query}
              onKeyPress={this.handleKeyPress}
              autoFocus
            />
          </div>
          <ArticleList className="search" articles={results} />
        </div>
      );
    }
    return <div>Loading</div>;
  }
}
