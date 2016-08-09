import React from 'react';
import Author from 'components/Author';
import FalcorController from 'lib/falcor/FalcorController';
import NotFound from 'components/NotFound';

export default class AuthorController extends FalcorController {
  static getFalcorPathSets(params) {
    // URL Format: thegazelle.org/author/:authorSlug

    // Multilevel request requires Falcor Path for each level of data requested
    return [
      ["authorsBySlug", params.authorSlug, ["name", "biography", "slug", "title", "photo"]],
      ["authorsBySlug", params.authorSlug, "articles", {"to": 10}, ["title", "image", "teaser", "issueId", "category", "slug", "featuredImage"]],
      ["authorsBySlug", params.authorSlug, "articles", {"to": 10}, "authors", {to: 10}, ["name", "slug"]],
    ];
  }

  // TODO: list all articles written by author x
  render() {
    if (this.state.ready) {
      if (this.state.data == null) {
        return (
          <NotFound />
        );
      } else {
        let authorSlug = this.props.params.authorSlug;
        const authorData = this.state.data.authorsBySlug[authorSlug];
        //console.log("Data: " + JSON.stringify(authorData));
        return (
          <div>
            <Author author={authorData} />
          </div>
        );
      }
    } else {
      return (
        <div>
          Loading
        </div>
      );
    }
  }
}
