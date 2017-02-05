// Render teams and team members
// Parents: AppController
// Children: TeamPage

import React from "react";
import FalcorController from 'lib/falcor/FalcorController';
import Helmet from "react-helmet"; // Add meta tags for pre-Ghost release

// Import components
import TeamPage from "components/TeamPage";
import NotFound from "components/NotFound";

export default class TeamPageController extends FalcorController {
  static getFalcorPathSets() {
    return [
      ["teamsByIndex", {length: 10}, ["name"]],
      ["teamsByIndex", {length: 10}, "authors", {length: 50}, ["name", "slug", "job_title", "image"]],
    ];
  }

  render () {
    if (this.state.ready) {
      if (!this.state.data) {
        return (
          <NotFound />
        );
      } else {
        const teamData = this.state.data.teamsByIndex;
        const meta = [
          // Search results
          {name: "description", content: "The Gazelle's dedicated student team."},

          // Social media
          {property: "og:title", content: "Our Team | The Gazelle"},
          {property: "og:type", content: "website"},
          {property: "og:url", content: "www.thegazelle.org/team"},
          {property: "og:description", content: "The Gazelle's dedicated student team."},
        ];
        // Top level elements can't have classes or it will break transitions
        return (
          <div>
            <Helmet
              meta={meta}
              title={"Our Team | The Gazelle"}
            />
            <TeamPage teamData={teamData} />
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
