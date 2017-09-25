// Render teams and team members
// Parents: AppController
// Children: TeamPage

import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import Helmet from 'react-helmet'; // Add meta tags for pre-Ghost release

// Import components
import TeamPage from 'components/TeamPage';
import NotFound from 'components/NotFound';
import TeamPageLoad from 'transitions/TeamPageLoad';

export default class TeamPageController extends FalcorController {
  static getFalcorPathSets() {
    return [
      ['semesters', 'latest', { length: 10 }, 'teamInfo', 'name'],
      [
        'semesters', 'latest',
        { length: 10 },
        'members',
        { length: 50 },
        ['name', 'slug', 'job_title', 'image'],
      ],
    ];
  }

  render() {
    if (this.state.ready) {
      if (!this.state.data) {
        return (
          <NotFound />
        );
      }
      const teamData = this.state.data.semesters.latest;
      const meta = [
        // Search results
        { name: 'description', content: "The Gazelle's dedicated student team." },

        // Social media
        { property: 'og:title', content: 'Our Team | The Gazelle' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'www.thegazelle.org/team' },
        { property: 'og:description', content: "The Gazelle's dedicated student team." },
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
    return <TeamPageLoad />;
  }
}
