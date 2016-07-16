import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';

export default class CategoryController extends FalcorController {
  static getFalcorPath(params) {
  //   // URL Format: thegazelle.org/:category
  //
  //   // Multilevel request requires Falcor Path for each level of data requested
  //   return [
  //     // path to first 10(?) articles from params.category
  //   ];
  }

  render() {
    console.log("RENDERING CATEGORY CONTROLLER");
    return(
      <div>
        test
      </div>
    )
  }
}
