import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import ArticleList from 'components/ArticleList';

export default class CategoryController extends FalcorController {
  static getFalcorPathSets(params) {
    // URL Format: thegazelle.org/category/:category

    // Multilevel request requires Falcor Path for each level of data requested
    // Grab first 10 articles for category requested
    return [
      ["categories", params.category, {length: 10}, ["title", "teaser", "issueId", "category", "slug", "featuredImage"]],
      ["categories", params.category, {length: 10}, "authors", {length: 10}, ["name", "slug"]],
    ];
  }

      // TODO: establish featured article, editor's picks, and trending sections

  render() {
    if (this.state.ready) {
      let category = this.props.params.category;
      const categoryData = this.state.data.categories[category];
      //console.log("Data: " + JSON.stringify(categoryData));
      return (
        <div className="category">
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
          Loading
        </div>
      );
    }
  }
}
