import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import ArticleList from 'components/ArticleList';

export default class CategoryController extends FalcorController {
  static getFalcorPath(params) {
    // URL Format: thegazelle.org/category/:category

    // Multilevel request requires Falcor Path for each level of data requested
    // Grab first 10 articles for category requested
    return [
      ["categories", params.category, {to: 10}, ["title", "teaser", "issueId", "category", "slug"]],
      ["categories", params.category, {to: 10}, "authors", {to: 10}, ["name", "slug"]],
    ];
  }

      // TODO: establish featured article, editor's picks, and trending sections

  render() {
    if (this.state.ready) {
      console.log("RENDERING CATEGORY CONTROLLER");
      let category = this.props.params.category;
      const categoryData = this.state.data.categories[category];
      console.log("Data: " + JSON.stringify(categoryData));
      return (
        <div>
          {/*
            <div>Controller for category: {category}</div>
            <div>Ready?: {this.state.ready ? 'true' : 'false'}</div>
          */}

          {/* Render all articles fetched through ArticleList */}
          <ArticleList articles={categoryData} />
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
