import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import ArticlePreview from 'components/ArticlePreview';

export default class CategoryController extends FalcorController {
  static getFalcorPath(params) {
    // URL Format: thegazelle.org/category/:category

    // Multilevel request requires Falcor Path for each level of data requested
    // Grab first 10 articles for category requested
    return [
      ["categories", params.category, {to: 10}, ["title", "teaser"]],
    ];
  }

  render() {
    console.log("RENDERING CATEGORY CONTROLLER");
    if (this.state.ready) {
      let category = this.props.params.category;
      const categoryData = this.state.data.categories[category];
      console.log("Data: " + JSON.stringify(categoryData));
      return (
        <div>
          <div>Controller for category: {category}</div>
          <div>Ready?: {this.state.ready ? 'true' : 'false'}</div>
          <ArticlePreview
            title={categoryData[0].title}
            teaser={categoryData[0].teaser}
          />
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
