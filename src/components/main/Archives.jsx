import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import { Link } from 'react-router';
import moment from 'moment';

export default class Archives extends BaseComponent {
  render() {
    const renderIssueList =
      // Returns reversed array of issues
      this.props.archivesData
        .map(issue => (
          <div key={issue.issueNumber} className="archives__issue-item">
            <Link to={`/issue/${issue.issueNumber}`}>
              <h1 className="archives__issue-item__issue-name">
                {`${issue.name}`}
              </h1>
              <p className="archives__issue-item__publication-date">
                {moment(issue.published_at).format('MMM DD, YYYY')}
              </p>
            </Link>
          </div>
        ))
        .reverse();
    return <div className="archives">{renderIssueList}</div>;
  }
}

Archives.propTypes = {
  archivesData: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      issueNumber: React.PropTypes.number,
      published_at: React.PropTypes.number,
    }),
  ),
};
