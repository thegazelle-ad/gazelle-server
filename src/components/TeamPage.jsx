import React from "react";
import _ from "lodash";
import BaseComponent from 'lib/BaseComponent';

import TeamMembersList from 'components/TeamMembersList';

export default class TeamPage extends BaseComponent {
  render () {
    const renderTeams =
      _.map((this.props.teamData || []), (team) => {
        return (
          <div key={team.name} className="team-page__team">
            <h2 className="section-header">{team.name}</h2>
            <TeamMembersList members={team.authors} />
          </div>
        );
      });

    // Top level elements can't have classes or it will break transitions
    return (
      <div className="team-page">
        <h2 className="team-page__title">{"Our Team"}</h2>
        {renderTeams}
      </div>
    );
  }
}

TeamPage.propTypes = {
  teamData: React.PropTypes.object,
}
