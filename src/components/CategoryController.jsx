import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import Helmet from 'react-helmet';
import ArticleList from 'components/ArticleList';
import NotFound from 'components/NotFound';

export default class CategoryController extends FalcorController {
  static getFalcorPathSets(params) {
    // URL Format: thegazelle.org/category/:category

    // Multilevel request requires Falcor Path for each level of data requested
    // Grab first 10 articles for category requested
    return [
      ["categoriesBySlug", params.category, "name"],

      ["categoriesBySlug", params.category, "articles", {length: 10}, ["title", "teaser", "issueNumber", "category", "slug", "image"]],
      ["categoriesBySlug", params.category, "articles", {length: 10}, "authors", {length: 10}, ["name", "slug"]],
    ];
  }



  render() {
    if (this.state.ready) {
      if (this.state.data == null) {
        return (
          <NotFound />
        );
      } else {
        let category = this.props.params.category;
        const categoryData = this.state.data.categoriesBySlug[category];
        let uppercase = (str) => {
            let array = str.split(' ');
            let newArray = [];

            for(var x = 0; x < array.length; x++){
                newArray.push(array[x].charAt(0).toUpperCase()+array[x].slice(1));
            }
            return newArray.join(' ');
        }
        const meta = [
          // Search results
          {name: "description", content: "The Gazelle is a weekly student publication, serving the NYU Abu Dhabi community and the greater Global Network University at NYU."},

          // Social media
          {property: "og:title", content: "The Gazelle"},
          {property: "og:type", content: "website"},
          {property: "og:url", content: "www.thegazelle.org/category/" + categoryData.slug},
          {property: "og:description", content: "The Gazelle is a weekly student publication serving the NYU Abu Dhabi community."},
        ];
        return (
          <div className="category">
            <Helmet
              meta={meta}
              title={uppercase(categoryData.name) + " | The Gazelle"}
            />
            <h2 className="category__header">{categoryData.name}</h2>
            
            {/* Render all articles fetched through ArticleList */}
            <ArticleList articles={categoryData.articles} />
          </div>
        );
      }
    } else {
      return (
        <div>
          Loading
        </div>
      );
    }
  }
}
