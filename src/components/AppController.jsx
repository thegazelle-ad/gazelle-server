import React from 'react';
import { setAppReady } from 'lib/falcor/falcorUtils';
import ReactTransitionGroup from 'react-addons-transition-group';
import _ from 'lodash';
import { TransitionManager } from 'lib/loader';
import FalcorController from 'lib/falcor/FalcorController';
import { mapLegacyIssueSlugsToIssueNumber } from 'lib/utilities';

// Components
import Header from 'components/Header';
import Navigation from 'components/Navigation';
import Footer from 'components/Footer';
import Loader from 'components/Loader';

import 'styles/main.scss';

export default class AppController extends FalcorController {
  componentDidMount() {
    super.componentDidMount();
    setAppReady();
  }

  // Data for rendering the navigation bar dynamically
  static getFalcorPathSets(params) {
    if (params.issueNumber) { // User is on archived issue page
      const issueNumber = mapLegacyIssueSlugsToIssueNumber(params.issueNumber);
      return [
        ['latestIssue', ['issueNumber']], // Used for robustness when setting navigationData
        ['issuesByNumber', issueNumber, ['publishedAt', 'issueNumber']],
      ];
    } else { // User is on home page
      return [
        ['latestIssue', ['publishedAt', 'issueNumber']],
      ];
    }
  }

  render() {
    const transitionKey = _.reduce(this.props.params, (keyString, val, key) => {
      return keyString + '&' + val + '=' + key;
    }, 'keystring');

    let navigationData = null;
    if (this.state.ready) { // Maintains async enviornment
      if ((this.props.params.issueNumber) && (this.props.params.issueNumber != this.state.data.latestIssue.issueNumber)) { // User is on an archived issuepage
        const issueNumber = mapLegacyIssueSlugsToIssueNumber(this.props.params.issueNumber);
        navigationData = this.state.data.issuesByNumber[issueNumber];
      } else { // User is on home page, categories, author page, info page, etc.
        if (this.props.params.issueNumber) { // User is on an article from current issue
          navigationData = this.state.data.issuesByNumber[this.state.data.latestIssue.issueNumber];
        } else { navigationData = this.state.data.latestIssue; }
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
