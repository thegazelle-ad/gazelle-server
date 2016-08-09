import React from "react";
import BaseComponent from "lib/BaseComponent";
import { setAppReady } from "lib/falcor/falcorUtils";
import ReactTransitionGroup from 'react-addons-transition-group';
import _ from "lodash";
import { TransitionManager } from "lib/loader"
import { setContextForGlobalErrorFunctions, resetContextForGlobalErrorFunctions, setGlobalError } from 'lib/utilities';

// Components
import Navigation from "components/Navigation";
import Footer from "components/Footer";
import Loader from "components/Loader";
import AlertBar from 'components/AlertBar';

// Application CSS; applicationStyles alias,
// CSS and SCSS loaders in webpack.config.js
require('applicationStyles');

export default class AppController extends BaseComponent {
  constructor(props) {
    super(props);
    this.safeSetState({
      error: null,
      displayErrorMessage: false,
    });
  }

  componentDidMount() {
    setContextForGlobalErrorFunctions.call(this);
    window.onerror = (message, url, lineNo, columNo, error) => {
      setGlobalError(err);
    }
    super.componentDidMount();
    setAppReady();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    resetContextForGlobalErrorFunctions();
  }

  render() {
    let lostInternetFlag = false;
    if (this.state.error) {
      let error = this.state.error;
      if (!(error instanceof Error)) {
        error = {toString: () => {return "this.state.error was not an error object, and therefore can't give you an error log. The error looked like this: " + JSON.stringify(error);}}
      }
      if (error.message === "Response code 0") {
        lostInternetFlag = true;
      }
      else {
        return (
          // I use anchor tags here because I want the page to reload. If we really had an exceptional error we want the user to restart the whole client
          // This will also clear the error object, and that's why I don't clear it specifically. If for some reason future developers
          // choose to use react-router Links or something similar that doesn't reload remember to do resetGlobalError();
          <div>
            <p>
              Sorry, The Gazelle has crashed due to an unexpected error. The web development team would appreciate
              it if you would send us an email with the error message by pressing the button below. After sending us
              an email you can either try pressing the refresh button, or go back to the homepage by pressing <a href="/">this link {/*style this as well*/}</a>.
            </p>
            <a href={"mailto:gazellewebdevelopmentaddress@gmail.com?subject=Error Report&body="+error.toString()}>Style This</a>
            <button type="button" onClick={() => {window.location.reload()}}>Style This Too</button>
            <p>For developers</p>
            <button type="button" onClick={() => {this.safeSetState({displayErrorMessage: !this.state.displayErrorMessage})}}>Display Error</button>
            {
              this.state.displayErrorMessage ?
                <p>{error.toString()}</p>
                : null
            }
          </div>
        );
      }
    }
    const transitionKey = _.reduce(this.props.params, (keyString, val, key) => {
      return keyString + "&" + val + "=" + key;
    }, "keystring");
    return (
      <div className="app-container">
        <Loader percent={30} />
        {
          lostInternetFlag ?
            <AlertBar message={'Internet connection lost, please try to connect again.'} />
            : null
        }
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
