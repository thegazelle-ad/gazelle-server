import React from 'react';
import FalcorController from 'lib/falcor/FalcorController'

export default class EditorAuthorListController extends FalcorController {
  static getFalcorPathSets(params) {
    return [];
  }

  render() {
    return <div><p>Hi</p></div>;
  }
}
