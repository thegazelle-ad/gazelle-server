import React from "react";
import _ from "lodash";
import BaseComponent from 'lib/BaseComponent';
import { Link } from "react-router";

export default class TeamMembersList extends BaseComponent {
  render () {
    const renderMembers =
      _.map((this.props.members || []), (member) => {
        const memberImage = member.image ? member.image : "http://0.gravatar.com/avatar/c63ec0271e2c8a10b2e343bbd1dec547?s=200&d=http%3A%2F%2F0.gravatar.com%2Favatar%2Fad516503a11cd5ca435acc9bb6523536%3Fs%3D200&r=G";
        return (
          <Link
            to={'/author/' + member.slug}
            key={member.name}
            className="team-page__team__members__member"
          >
            <img src={memberImage} alt="Team Member"className="team-page__team__members__member__image" />
            <h2 className="team-page__team__members__member__name">{member.name}</h2>
            <h3 className="team-page__team__members__member__job-title">{member.job_title}</h3>
          </Link>
        );
      });

    // Top level elements can't have classes or it will break transitions
    return (
      <div className="team-page__team__members">
        {renderMembers}
      </div>
    );
  }
}

TeamMembersList.propTypes = {
  members: React.PropTypes.object,
}
