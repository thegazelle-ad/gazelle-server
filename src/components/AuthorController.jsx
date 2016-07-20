import React from 'react';
import Author from 'components/Author';
import FalcorController from 'lib/falcor/FalcorController';

export default class AuthorController extends FalcorController {
  static getFalcorPath(params) {
    // URL Format: thegazelle.org/author/:authorSlug

    // Multilevel request requires Falcor Path for each level of data requested
    return [
      ["authorsBySlug", params.authorSlug, ["name", "biography", "slug"]],
      ["authorsBySlug", params.authorSlug, "articles", {"to": 10}, ["title", "image", "teaser", "issueId", "category", "slug"]],
    ];
  }

  // TODO: list all articles written by author x
  render() {
    console.log("RENDERING AUTHOR CONTROLLER");
    if (this.state.ready) {
      let authorSlug = this.props.params.authorSlug;
      const authorData = this.state.data.authorsBySlug[authorSlug];
      console.log("Data: " + JSON.stringify(authorData));
      return (
        <div>
          {/*
            <div>Controller for author: {authorData.name}</div>
            <div>Ready?: {this.state.ready ? 'true' : 'false'}</div>
          */}
          <Author author={authorData} />
        </div>
      );
    } else {
      return (
        <div>
          <h1>Loading</h1>
        </div>
      );
    }
  }
}
