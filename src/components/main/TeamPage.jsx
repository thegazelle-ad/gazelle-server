import React from 'react';
import _ from 'lodash';
import BaseComponent from 'lib/BaseComponent';
import { Link } from 'react-router';
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
        <Link to="/semester" className="team-page__semester">{this.props.semester}</Link>
        {renderTeams}
      </div>
    );
  }
}

TeamPage.propTypes = {
  teamData: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      teamInfo: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
      }).isRequired,
      members: TeamMembersList.propTypes.members,
    }),
  ).isRequired,
};

TeamPage.defaultProps = {
  teamData: [],
  semester: '',
};
