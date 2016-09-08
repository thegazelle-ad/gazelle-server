import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';

// Components
import NotFound from 'components/NotFound';
import Navigation from 'components/Navigation';

export default class NavigationController extends FalcorController {
  static getFalcorPathSets(params) {
    return [
      ["latestIssue", "pubDate"],
      // TODO: Write path to grab latest issue's number
      // Grabs max 10 categories from latest issue
      ["latestIssue", "categories", {length:10}, ["name", "slug"]],
    ];
  }

  render() {
    if (this.state.ready) {
      if (this.state.data == null) {
        return (
          <NotFound />
        );
      } else {
        const issueData = this.state.data.latestIssue;
        return (
          <div>
            <Navigation issueData={issueData} />
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
