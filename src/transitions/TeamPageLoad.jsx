import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class TeamPageLoad extends BaseComponent {
  render() {
    return (
      <div className="team-page-load">
        <h2 className="team-page__title-load"></h2>
        <div className='team-page__member-load'></div>
      </div>
    );
  }
}
