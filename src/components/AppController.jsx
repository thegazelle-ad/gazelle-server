import React from "react";
import BaseComponent from "lib/BaseComponent";
import { setAppReady } from "lib/falcor/falcorUtils";
import ReactTransitionGroup from 'react-addons-transition-group';
import _ from "lodash";
import { TransitionManager } from "lib/loader";

// Components
import Navigation from "components/Navigation";
import Footer from "components/Footer";
import Loader from "components/Loader"

// Application CSS; applicationStyles alias,
// CSS and SCSS loaders in webpack.config.js
require('applicationStyles');

export default class AppController extends BaseComponent {
  componentDidMount() {
    super.componentDidMount();
    setAppReady();
  }

  render() {
    const transitionKey = _.reduce(this.props.params, (keyString, val, key) => {
      return keyString + "&" + val + "=" + key;
    }, "keystring");
    return (
      <div className="app-container">
        <Loader percent={30} />
        <div className="app-container__header">
          <Navigation appName={"The Gazelle"} />
        </div>
        <div className="app-container__body">
          <ReactTransitionGroup
            transitionName="global-loader"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={3000}
            component={TransitionManager}
          >
            {React.cloneElement(this.props.children, {key: transitionKey})}
          </ReactTransitionGroup>
        </div>
        <div className="app-container__footer">
          <Footer />
        </div>
      </div>
    );
  }
}
