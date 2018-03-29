import React from 'react';
import _ from 'lodash';
import BaseComponent from 'lib/BaseComponent';

import TeamMembersList from 'components/main/TeamMembersList';

export default class TeamPage extends BaseComponent {
  render() {
    const renderTeams = _.map(this.props.teamData || [], team => (
      <div key={team.teamInfo.name} className="team-page__team">
        <h2 className="section-header">{team.teamInfo.name}</h2>
        <TeamMembersList members={team.members} />
      </div>
    ));

    // Top level elements can't have classes or it will break transitions
    return (
      <div className="team-page">
        <h2 className="team-page__title">Our Team</h2>
        {renderTeams}
      </div>
    );
  }
}

TeamPage.propTypes = {
  teamData: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      teamInfo: React.PropTypes.shape({
        name: React.propTypes.string.isRequired,
      }).isRequired,
      members: TeamMembersList.propTypes.members,
    }),
  ).isRequired,
};

TeamPage.defaultProps = {
  teamData: [],
};
