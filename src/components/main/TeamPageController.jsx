// Render teams and team members
// Parents: AppController
// Children: TeamPage

import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import Helmet from 'react-helmet'; // Add meta tags for pre-Ghost release
import _ from 'lodash';

// Import components
import TeamPage from 'components/main/TeamPage';
import NotFound from 'components/main/NotFound';

export default class TeamPageController extends FalcorController {
  static getFalcorPathSets() {
    return [
      ['semesters', 'latest', { length: 10 }, 'teamInfo', 'name'],
      [
        'semesters',
        'latest',
        { length: 10 },
        'members',
        { length: 50 },
        ['name', 'slug', 'job_title', 'image_url'],
      ],
    ];
  }

  static getOpenGraphInformation() {
    return [
      { property: 'og:title', content: 'Our Team | The Gazelle' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://www.thegazelle.org/category/team' },
      {
        property: 'og:description',
        content: "The Gazelle's dedicated student team.",
      },
    ];
  }

  render() {
    if (this.state.ready) {
      if (!this.state.data || Object.keys(this.state.data).length === 0) {
        return <NotFound />;
      }
      const teamData = _.map(this.state.data.semesters.latest, team => ({
        ...team,
        members: _.toArray(team.members),
      }));
      const meta = [
        // Search results
        {
          name: 'description',
          content: "The Gazelle's dedicated student team.",
        },

        // Social media
        ...TeamPageController.getOpenGraphInformation(),
      ];
      // Top level elements can't have classes or it will break transitions
      return (
        <div>
          <Helmet meta={meta} title="Our Team | The Gazelle" />
          <TeamPage teamData={teamData} />
        </div>
      );
    }
    return <div>Loading</div>;
  }
}
