import React from 'react';
import { setAppReady } from 'lib/falcor/falcor-utilities';
import ReactTransitionGroup from 'react-addons-transition-group';
import _ from 'lodash';
import { TransitionManager } from 'lib/loader';
import FalcorController from 'lib/falcor/FalcorController';
import { mapLegacyIssueSlugsToIssueNumber } from 'lib/utilities';

// Components
import Header from 'components/main/Header';
import Navigation from 'components/main/Navigation';
import Footer from 'components/main/Footer';
import Loader from 'components/main/Loader';

export default class AppController extends FalcorController {
  componentDidMount() {
    super.componentDidMount();
    setAppReady();
  }

  // Data for rendering the navigation bar dynamically
  static getFalcorPathSets(params) {
    if (params.issueNumber) {
      // User is on archived issue page
      const issueNumber = mapLegacyIssueSlugsToIssueNumber(params.issueNumber);
      return [
        ['issues', 'latest', ['issueNumber']], // Used for robustness when setting navigationData
        ['issues', 'byNumber', issueNumber, ['published_at', 'issueNumber']],
      ];
    }
    // User is on home page
    return [['issues', 'latest', ['published_at', 'issueNumber']]];
  }

  render() {
    const transitionKey = _.reduce(
      this.props.params,
      (keyString, val, key) => `${keyString}&${val}=${key}`,
      'keystring',
    );

    let navigationData = null;
    if (this.state.ready) {
      // Maintains async enviornment
      if (
        this.props.params.issueNumber &&
        this.props.params.issueNumber !==
          this.state.data.issues.latest.issueNumber
      ) {
        // User is on an archived issuepage
        const issueNumber = mapLegacyIssueSlugsToIssueNumber(
          this.props.params.issueNumber,
        );
        navigationData = this.state.data.issues.byNumber[issueNumber];
      } else if (this.props.params.issueNumber) {
        // User is on an article from current issue
        const latestIssueNumber = this.state.data.issues.latest.issueNumber;
        navigationData = this.state.data.issues.byNumber[latestIssueNumber];
      } else {
        // User is on home page, categories, staff member page, info page, etc.
        navigationData = this.state.data.issues.latest;
      }
    }

    return (
      <div className="app-container">
        <Loader percent={30} />
        <div className="app-container__header">
          <Header />
          <Navigation navigationData={navigationData} />
        </div>
        <div className="app-container__body">
          <ReactTransitionGroup
            transitionName="global-loader"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={3000}
            component={TransitionManager}
          >
            {React.cloneElement(this.props.children, { key: transitionKey })}
          </ReactTransitionGroup>
        </div>
        <div className="app-container__footer">
          <Footer />
        </div>
      </div>
    );
  }
}
