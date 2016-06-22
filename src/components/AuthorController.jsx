import React from 'react';
import Author from 'components/Author';
import FalcorController from 'lib/falcor/FalcorController';

export default class AuthorController extends FalcorController {
  static getFalcorPath(params) {
    return ['pages', parseInt(params.id), ["title", "body"]];
  }

  render() {
    console.log("RENDERING AUTHOR CONTROLLER")
    if (this.state.ready) {
      const authorData = this.state.data.pages[parseInt(this.props.params.id)];
      return (
        <div>
          <h2>Controller for page: {this.props.params.id}</h2>
          <div>Ready?: {this.state.ready ? 'true' : 'false'}</div>
          <Author title={authorData.title} body={authorData.body} />
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
