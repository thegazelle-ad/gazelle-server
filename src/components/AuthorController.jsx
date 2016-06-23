import React from 'react';
import Author from 'components/Author';
import FalcorController from 'lib/falcor/FalcorController';

export default class AuthorController extends FalcorController {
  static getFalcorPath(params) {
    return ['authors', parseInt(params.authorId), ["name", "biography"]];
  }

  render() {
    console.log("RENDERING AUTHOR CONTROLLER")
    if (this.state.ready) {
      const authorData = this.state.data.authors[parseInt(this.props.params.authorId)];
      return (
        <div>
          <h2>Controller for page: {this.props.params.authorId}</h2>
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
