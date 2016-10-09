/*
 * TextPageController is used to display the About and Ethics pages as pages
 * of only text. The text used is passed in dynamically after it is sourced from
 * the database.
 */

import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import Helmet from "react-helmet"; // Add meta tags for pre-Ghost release

// Components
import Archives from 'components/Archives'
import NotFound from 'components/NotFound';

export default class ArchivesController extends FalcorController {
  static getFalcorPathSets() {
    return [
      // Returns 150 archived issues
      ["issuesByNumber", {length: 150}, ["issueNumber", "published_at"]],
    ];
  }

  render() {
    if (this.state.ready) {
      if (this.state.data === null) {
        return (
          <NotFound />
        );
      } else {
        const data = _.filter(this.state.data.issuesByNumber, (issue) => {
          return issue.published_at;
        });
        const meta = [
          // Search results
          {name: "description", content: "The Gazelle is a weekly student publication, serving the NYU Abu Dhabi community and the greater Global Network University at NYU."},

          // Social media
          {property: "og:title", content: "Archives | The Gazelle"},
          {property: "og:type", content: "website"},
          {property: "og:url", content: "www.thegazelle.org/archives"},
          {property: "og:image", content: "https://www.thegazelle.org/wp-content/themes/gazelle/images/gazelle_logo.png"},
          {property: "og:description", content: "The Gazelle is a weekly student publication serving the NYU Abu Dhabi community."},
        ];
        return (
          <div>
            <Helmet
              meta={meta}
              title={"Archives | The Gazelle"}
            />
            <Archives archivesData={data} />
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
