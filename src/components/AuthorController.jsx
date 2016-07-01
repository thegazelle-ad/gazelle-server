import React from 'react';
import Author from 'components/Author';
import FalcorController from 'lib/falcor/FalcorController';

export default class AuthorController extends FalcorController {
  static getFalcorPath(params) {
    // // Format: thegazelle.org/author/:authorSlug
    // TODO: add full author parameters: ["name", "biography", "articles", [{"from": 0, "to": 10}, "title", "image", "description"]]]
    return ["authors", params.authorSlug, ["name", "biography"]];
  }

  render() {
    console.log("RENDERING AUTHOR CONTROLLER");
    if (this.state.ready) {
      const authorData = this.state.data.authors[this.props.params.authorSlug];
      return (
        <div>
          <div>Controller for author: {authorData.name}</div>
          <div>Ready?: {this.state.ready ? 'true' : 'false'}</div>
          <Author name={authorData.name} biography={authorData.biography} />
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
