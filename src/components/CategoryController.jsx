import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import ArticlePreview from 'components/ArticlePreview';

export default class CategoryController extends FalcorController {
  static getFalcorPath(params) {
    // URL Format: thegazelle.org/category/:category

    // Multilevel request requires Falcor Path for each level of data requested
    // Grab first 10 articles for category requested
    return [
      ["categories", params.category, {to: 10}, ["title", "teaser", "issueId", "category", "slug", "uuid"]],
      ["categories", params.category, {to: 10}, "authors", {to: 10}, ["name", "slug"]],
    ];
  }

  render() {
    if (this.state.ready) {
      console.log("RENDERING CATEGORY CONTROLLER");
      let category = this.props.params.category;
      const categoryData = this.state.data.categories[category];

      // Render all articles in category as ArticlePreviews
      let renderArticles = () => {
        let data = [];
        for (let article in categoryData) {
          if (categoryData.hasOwnProperty(article)) {
            data.push(
              <ArticlePreview
                key={categoryData[article].uuid}
                article={categoryData[article]}
              />
            )
            console.log("Article: " + categoryData[article].title);
          }
        }
        return data;
      }

      console.log("Data: " + JSON.stringify(categoryData));
      return (
        <div>
          <div>Controller for category: {category}</div>
          <div>Ready?: {this.state.ready ? 'true' : 'false'}</div>
          {renderArticles()}
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
